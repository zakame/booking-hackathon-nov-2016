FROM tianon/mojo

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN cpanm App::cpm && cpm install -g Carton && cpm install

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/carton", "exec", "perl", "local/bin/morbo", "server.pl"]
