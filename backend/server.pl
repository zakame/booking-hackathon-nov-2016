#!/usr/bin/env perl
use Mojolicious::Lite;
use Mojo::Date;
use Mojo::Pg;
use Mojo::URL;
use Memoize;

sub fetch {
    my ( $c, $url ) = @_;
    $c->ua->get($url)->res->json;
}

sub normalize_url { shift; shift->to_string }

memoize( 'fetch', NORMALIZER => 'normalize_url' );

plugin 'PODRenderer';    # /perldoc

my $db_user = $ENV{DB_USER} || 'conf';
my $db_name = $db_user;
my $db_pass = $ENV{DB_PASSWORD} || 'booking';
my $db_host = $ENV{DB_HOST} || 'database';

my $config = plugin 'Config';

helper date => sub { Mojo::Date->new };

helper pg => sub {
    my $conn = "postgresql://$db_user:$db_pass\@$db_host/$db_name";
    state $pg = Mojo::Pg->new($conn);
};

helper getHotelAvailaibility => sub {
    my ( $c, $checkin, $checkout, $latitude, $longitude, $rad ) = @_;
    my ( $u, $p ) = @{$config}{qw/bkapi_user bkapi_pass/};

    my $ua  = $c->ua;
    my $url = Mojo::URL->new(
        "https://distribution-xml.booking.com/json/getHotelAvailabilityV2");
    $url->userinfo("$u:$p");
    $url->query(
        checkin   => $checkin,
        checkout  => $checkout,
        room1     => 'A',
        radius    => $rad,
        latitude  => $latitude,
        longitude => $longitude,
        output    => 'room_policies,room_details,hotel_details',
    );

    app->log->debug($url);

    fetch( $c, $url );
};

under sub {
    my $c = shift;

    $c->res->headers->cache_control('no-cache');
    $c->res->headers->access_control_allow_origin('*');

    return 1;
};

get '/conferences/:id/hotels' => sub {
    my $c  = shift;
    my $id = $c->stash('id');
    my $db = $c->pg->db;

    # find dates, lat, lng from db
    my $res = $db->query(
        'select start_date, end_date, lat, lng from booking_conference where id = ?',
        $id
    )->hash;

    # check start and end dates, then estimate possible checkin/checkout dates
    (   my $start_date = $c->date->parse(
            $c->date->parse( $res->{start_date} . "T00:00:00Z" )->epoch
                - 86400
        )->to_datetime
    ) =~ s/T.*Z//;

    # make the checkout date be a day after the conf
    (   my $end_date = $c->date->parse(
            $c->date->parse( $res->{end_date} . "T00:00:00Z" )->epoch + 172800
        )->to_datetime
    ) =~ s/T.*Z//;

    app->log->debug("$start_date $end_date");

    $c->render(
        json => $c->getHotelAvailaibility(
            ${start_date}, ${end_date}, $res->{lat}, $res->{lng}, 15
        )
    );
};

app->start;
