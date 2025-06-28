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
        // This is the ONLY function the login button should call.
        async GoogleDriveSignIn() {
            console.log("Starting a clean, modern sign-in flow...");

            // 1. Initialize the GAPI client so it's ready to make API calls later.
            // We also load the 'oauth2' helper library needed for the token exchange.
            try {
                await new Promise((resolve, reject) => {
                    window.gapi.load('client', () => {
                        window.gapi.client.init({
                            apiKey: this.GoogleDriveApi.API_KEY,
                            discoveryDocs: [this.GoogleDriveApi.DISCOVERY_DOC],
                        }).then(() => window.gapi.client.load('oauth2', 'v2')).then(resolve).catch(reject);
                    });
                });
                this.GoogleDriveApi.gapiInited = true;
                console.log("GAPI and GAPI-OAuth2 clients are ready.");
            } catch (err) {
                console.error("Error initializing GAPI client:", err);
                return; // Stop if GAPI fails
            }

            // 2. Initialize the GIS Code Client for the pop-up flow.
            try {
                const tokenClient = window.google.accounts.oauth2.initCodeClient({
                    client_id: this.GoogleDriveApi.CLIENT_ID,
                    scope: this.GoogleDriveApi.SCOPES,
                    callback: (response) => {
                        // 3. This callback runs AFTER the user signs in and grants permission.
                        if (response.code) {
                            console.log("Code received. Exchanging for token...");
                            const xhr = new XMLHttpRequest();
                            xhr.open('POST', 'https://oauth2.googleapis.com/token');
                            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                            xhr.onload = () => {
                                // IMPORTANT: First, check if the request was successful
                                if (xhr.status === 200) {
                                    const tokens = JSON.parse(xhr.responseText);
                                    window.gapi.client.setToken(tokens); // Set the token for GAPI
                                    this.GoogleDriveApi.loggedin = true;
                                    console.log("Token received, login complete!");
                                } else {
                                    console.error("Token exchange failed!", xhr.status, xhr.responseText);
                                }
                            };
                            xhr.onerror = function() {
                                console.error("Error during token exchange request.");
                            };
                            // This is the corrected request body with the required 'grant_type'
                            const requestBody = `code=${response.code}&client_id=${this.GoogleDriveApi.CLIENT_ID}&grant_type=authorization_code&redirect_uri=postmessage`;
                            xhr.send(requestBody);
                            // ...
                        } else {
                            console.error("Error: No authorization code received.", response);
                        }
                    },
                });

                // 4. With everything initialized, trigger the login pop-up for the user.
                console.log("Requesting authorization code from user...");
                tokenClient.requestCode();

            } catch (err) {
                console.error("Error initializing GIS Code Client:", err);
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

        // ... PASTE YOUR EXISTING GoogleDriveListFiles, GoogleDriveReadFile, and GoogleDriveWriteFile functions here ...
    }
}
export default GoogleDriveApi