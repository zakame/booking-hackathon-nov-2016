#!/usr/bin/env perl
use Mojolicious::Lite;
use Mojo::Pg;
use Mojo::URL;

plugin 'PODRenderer';    # /perldoc

my $db_user = $ENV{DB_USER} || 'conf';
my $db_name = $db_user;
my $db_pass = $ENV{DB_PASSWORD} || 'booking';
my $db_host = $ENV{DB_HOST} || 'database';

my $config = plugin 'Config';

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

    $ua->get($url)->res->json;
};

under sub {
    my $c = shift;

    $c->res->headers->cache_control('no-cache');
    $c->res->headers->access_control_allow_origin('*');
};

get '/conferences/:id/hotels' => sub {
    my $c  = shift;
    my $id = $c->stash('id');
    my $db = $c->pg->db;

    # find lat, lng from db
    my $coord
        = $db->query( 'select lat, lng from booking_conference where id = ?',
        $id )->hash;

    $c->render(
        json => $c->getHotelAvailaibility(
            '2016-12-01', '2016-12-10', $coord->{lat}, $coord->{lng}, 15
        )
    );
};

app->start;
