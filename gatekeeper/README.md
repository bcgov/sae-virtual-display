# Virtual Display Gatekeeper

## Installation

```
docker build . -t vdi-gatekeeper
```

## Troubleshooting

### Keyboard layouts

```
docker run -ti --rm --entrypoint /bin/bash -u root -p 5550:5000 vdi-gatekeeper

DEBIAN_FRONTEND=noninteractive apt-get install -y console-common

apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --allow-unauthenticated \
        curl \
        i3 \
        language-pack-en-base \
        openssh-server \
        x11-apps \
        xserver-xephyr \
        xterm \
 && apt-get clean -y \
 && apt-get autoremove -y \
 && rm -rf /var/lib/apt/lists/*

# Xvfb +extension GLX +extension Composite -dpi 96 -nolisten tcp -noreset -screen 0 5760x2560x24+32 -auth /home/jovyan/.Xauthority :100 &

xpra start :100 $XPRA_ARGS --bind-tcp=0.0.0.0:5000 --start-new-commands=no --resize-display=yes --fake-xinerama=no --pulseaudio=off --printing=no --mdns=no --webcam=no --clipboard=no --file-transfer=no --open-files=no --pulseaudio=no --speaker=off --printing=no --microphone=off --keyboard-layout=us --html=on


setxkbmap -query

cat /usr/share/X11/xkb/rules/evdev.lst

# apt-get update && apt-get install -y fluxbox

var LANGUAGE_TO_LAYOUT={ca:"caeng"};


var nav=window.navigator,browserLanguagePropertyKeys=["language","browserLanguage","systemLanguage","userLanguage"],i,language;
if(Array.isArray(nav.languages)){
    for(i=0;i<nav.languages.length;i++){
        language=nav.languages[i];
        if(language&&language.length){
            return language
        }
    }
}
for(i=0;i<browserLanguagePropertyKeys.length;i++){
    var prop=browserLanguagePropertyKeys[i];
    language=nav[prop];
    if(language&&language.length){
        return language
    }
}
return null


020-04-27 21:13:52,012 setting keyboard layout to 'xx'
The XKEYBOARD keymap compiler (xkbcomp) reports:
> Error:            Can't find file "xx" for symbols include
>                   Exiting
>                   Abandoning symbols file "default"
Errors from xkbcomp are not fatal to the X server


```

## Testing

```

docker run -ti --rm \
  -p 8888:8888 \
  -e JUPYTERHUB_SERVICE_PREFIX="/user/USERID/SERVERID/"\
  vdi-gatekeeper

Optional:
  -e XPRA_ARGS="--use-display"

```