{
    const Tabs = {} as { [ key: number ]: { timeStamp: number, url: string } };
    let Layering = true;

    function promisize( fn: any, params: Array<unknown> ): Promise<any> {
        return new Promise( response => fn( ...params, response ) );
    }

    function logger( type: string ) {
        return function () { console.log( type, ...arguments ) }
    }

    function keepAlive( message: string, sender: chrome.runtime.MessageSender, sendResponse: ( arg0: unknown ) => unknown ): void {
        sendResponse( true );
    }

    function BeforeNavigate( { tabId, timeStamp, url }: chrome.webNavigation.WebNavigationParentedCallbackDetails ) {
        console.log( "BeforeNavigate", tabId, timeStamp, url );
        Tabs[ tabId ] = { timeStamp, url }
    }

    async function CreatedNavigationTarget( { sourceTabId, tabId, url }: chrome.webNavigation.WebNavigationSourceCallbackDetails ) {
        chrome.tabs.get( tabId )
            .then( ( { windowId } ) => chrome.windows.get( windowId ) )
            .then( ( { type, id } ) => new Promise( ( res: Function, rej: Function ) => ( type === "popup" ? res( id ) : rej() ) ) )
            .then( function ( windowId ): void {
                if ( Layering ) {
                    chrome.windows.remove( <number>windowId )
                    chrome.tabs.sendMessage( sourceTabId, { type: "layering", url } );
                }
                else {
                    chrome.tabs.get( sourceTabId )
                        .then( ( { windowId, index } ) => chrome.tabs.move( tabId, { windowId, index: index + 1 } ) )
                        .then( () => chrome.tabs.update( tabId, { active: true } ) )

                }
            } )
            .catch( () => false )
    }

    function activate() {
        chrome.runtime.onMessage.addListener( keepAlive )
        //chrome.webNavigation.onBeforeNavigate.addListener( logger( "BeforeNavigate" ) )
        //chrome.webNavigation.onCreatedNavigationTarget.addListener( logger( "CreatedNavigationTarget" ) )
        chrome.webNavigation.onBeforeNavigate.addListener( BeforeNavigate )
        chrome.webNavigation.onCreatedNavigationTarget.addListener( CreatedNavigationTarget )
    }

    activate()
}