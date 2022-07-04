{
    const { id }: { id: string } = chrome.runtime;
    const iframes = [] as Array<HTMLElement>;
    const layerPopup = document.createElement( "div" );
    const basePx = 350;
    layerPopup.id = "layerPopup";
    Object.assign( layerPopup.style, {
        display: "none",
        position: "fixed",
        bottom: "0",
        right: "0",
        zIndex: "2147483647",
        boxSizing: "border-box",
        width: `${ basePx }px`,
    } );
    document.body.appendChild( layerPopup );
    // @ts-ignore
    const draggable = new Draggable( [ document.body ], { draggable: 'div#layerPopup' } )

    function keepAlive(): void {
        try {
            chrome.runtime.sendMessage( id, "keepAlive", { includeTlsChannelId: false } )
                .then( () => new Promise( res => setTimeout( res, 240e3 ) ) )
                .then( keepAlive )
        }
        catch {
            location.reload();
        }
    }

    function layering( { type, url }: { type: string, url: string }, sender: chrome.runtime.MessageSender, sendResponse: Function ) {
        switch ( type ) {
            case "layering": {
                let iframe = document.createElement( "iframe" );
                iframe.src = url;
                layerPopup.appendChild( iframe );
                Object.assign( iframe.style, {
                    width: `${ basePx }px`,
                    height: `${ basePx }px`,
                    float: "left",
                } );
                iframes.push( iframe );

                Object.assign( layerPopup.style, {
                    display: "block",
                    height: `${ basePx * iframes.length + 50 }px`,
                } );

                break;
            }
        }

        sendResponse();
    }

    keepAlive()
    chrome.runtime.onMessage.addListener( layering );
}