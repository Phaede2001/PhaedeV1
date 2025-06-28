const GoogleDriveApi = {
    data() {
        return {
            GoogleDriveApi: {
                CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
                DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
                SCOPES: 'https://www.googleapis.com/auth/drive.file',
                gapiInited: false,
                gisInited: false,
                tokenClient: null,
                loggedin: false,
                files: [],
                CURRENT_FILE_OBJ: null,
                CURRENT_FILE_NAME: "",
                CURRENT_FILE_CONTENTS: "",
                loading: false
            }
        }
    },
    methods: {
        // Main entry point, called by the button
        GoogleDriveSignIn() {
            console.log("Starting Sign-In Process...");
            // The GAPI client library needs to be loaded to make API calls later.
            window.gapi.load('client', () => this.GoogleDriveInitializeGapi());
            // The GIS client library is needed for the pop-up. We will initialize it.
            this.GoogleDriveInitializeGisClient();
        },

        // Initializes the GAPI library to be ready to make calls to the Drive API
        async GoogleDriveInitializeGapi() {
            console.log("Step 1: Initializing GAPI client...");
            await window.gapi.client.init({
                apiKey: this.GoogleDriveApi.API_KEY,
                discoveryDocs: [this.GoogleDriveApi.DISCOVERY_DOC],
            });
            
            // THIS IS THE NEW, CRITICAL LINE
            await window.gapi.client.load('oauth2', 'v2'); 
            
            this.GoogleDriveApi.gapiInited = true;
            this.GoogleDriveCheckAuthStatus();
        },

        // Initializes the modern GIS "Code Client" for handling the user-facing login
        GoogleDriveInitializeGisClient() {
            console.log("Initializing GIS code client...");
            
            // Check if google.accounts.oauth2 is available. If not, wait.
            if (window.google && window.google.accounts && window.google.accounts.oauth2) {
                this.GoogleDriveApi.tokenClient = window.google.accounts.oauth2.initCodeClient({
                    client_id: this.GoogleDriveApi.CLIENT_ID,
                    scope: this.GoogleDriveApi.SCOPES,
                    callback: (response) => {
                        // This callback is triggered ONLY after the user signs in and grants consent.
                        // The response contains the authorization code.
                        if (response.code) {
                            console.log("Authorization successful. Exchanging code for token.");
                            
                            // Now we need to exchange the code for an access token
                            const xhr = new XMLHttpRequest();
                            xhr.open('POST', 'https://oauth2.googleapis.com/token');
                            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                            xhr.onload = () => {
                                const tokens = JSON.parse(xhr.responseText);
                                window.gapi.client.setToken(tokens); // IMPORTANT: Set the token for GAPI
                                this.GoogleDriveApi.loggedin = true;
                                console.log("Token received, login complete!");
                            };
                            xhr.onerror = function() {
                                console.error("Error during token exchange request.");
                            };
                            xhr.send('code=' + response.code +
                                '&client_id=' + this.GoogleDriveApi.CLIENT_ID +
                                '&redirect_uri=postmessage'); // 'postmessage' is the required value for this flow
                        } else {
                            console.error('Authorization response did not contain a code.', response);
                        }
                    },
                });
                this.GoogleDriveApi.gisInited = true;
            } else {
                // If the library isn't ready, wait a moment and try again.
                setTimeout(() => this.GoogleDriveInitializeGisClient(), 100);
            }
        },
        
        // This function is now SIMPLE and has only one job: trigger the popup.
        GoogleDriveAuthStart() {
            // We only proceed if both libraries are ready.
            if (this.GoogleDriveApi.gapiInited && this.GoogleDriveApi.gisInited && this.GoogleDriveApi.tokenClient) {
                console.log("Both clients ready. Requesting authorization code from user...");
                this.GoogleDriveApi.tokenClient.requestCode();
            } else {
                // If the clients aren't ready, we call the SignIn function again, which will
                // re-run the initializers and checks.
                console.log("One of the clients was not ready, re-initiating sign-in flow.");
                this.GoogleDriveSignIn();
            }
        },
        
        // The SignOut, ListFiles, and other functions remain the same
        GoogleDriveSignOut() {
            const token = window.gapi.client.getToken();
            if (token !== null) {
                window.google.accounts.oauth2.revoke(token.access_token);
                window.gapi.client.setToken('');
                this.GoogleDriveApi.loggedin = false
                this.$root.$data.popup.name = null
            }
        },
        // ... [ The rest of your functions like GoogleDriveListFiles, GoogleDriveReadFile, etc. can remain exactly as they were. Paste them here. ] ...
    }
}
export default GoogleDriveApi