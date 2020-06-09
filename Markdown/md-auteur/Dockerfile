FROM debian:buster
MAINTAINER Tristan Colombo <tristan@gnulinuxmag.com>

RUN apt update && apt -y install wget zip \
    && apt -y install plantuml \
    && apt -y install vim gedit \
    && apt -y install gdebi \
    && apt -y install software-properties-common \
    && wget https://github.com/jgm/pandoc/releases/download/2.9.1.1/pandoc-2.9.1.1-1-amd64.deb \
    && dpkg -i pandoc-2.9.1.1-1-amd64.deb \
    && rm pandoc-2.9.1.1-1-amd64.deb

# Typora installation
RUN wget -qO - https://typora.io/linux/public-key.asc | apt-key add -
RUN add-apt-repository 'deb https://typora.io/linux ./'
RUN apt update
RUN apt install typora

# Visual Studio Code installation
RUN wget -P /tools https://packages.microsoft.com/repos/vscode/pool/main/c/code/code_1.45.1-1589445302_amd64.deb 
RUN gdebi --n /tools/code_1.45.1-1589445302_amd64.deb
RUN rm /tools/code_1.45.1-1589445302_amd64.deb

# Install md-auteur
COPY pandoc-md-auteur /opt/pandoc-md-auteur

# User glmf creation
RUN useradd -d /home/glmf glmf

# Copy glmf tool 
COPY glmf /opt/tools/glmf
RUN chown -R glmf:glmf /opt/tools

USER glmf

WORKDIR /home/glmf

ENV PATH="${PATH}:/opt/tools:."
ENV EDITOR='code'