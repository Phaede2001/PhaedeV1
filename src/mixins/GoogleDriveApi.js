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
        // This is the main entry point called by the button in your Vue component
        GoogleDriveSignIn() {
            console.log("Starting Sign-In Process...");
            // Load the GAPI client library
            window.gapi.load('client', () => this.GoogleDriveInitializeGapi());
            // Initialize the GIS client
            this.GoogleDrivegisLoaded();
        },

        // 1. Initializes the older GAPI library so we can make API calls (like listing files)
        async GoogleDriveInitializeGapi() {
            console.log("Step 1: Initializing GAPI client...");
            await window.gapi.client.init({
                apiKey: this.GoogleDriveApi.API_KEY,
                discoveryDocs: [this.GoogleDriveApi.DISCOVERY_DOC],
            });
            this.GoogleDriveApi.gapiInited = true;
            this.GoogleDriveCheckAuthStatus();
        },

        // 2. Initializes the NEW Google Identity Services (GIS) client for the popup flow
        async GoogleDrivegisLoaded() {
            console.log("Step 2: Initializing GIS code client...");
            this.GoogleDriveApi.tokenClient = window.google.accounts.oauth2.initCodeClient({
                client_id: this.GoogleDriveApi.CLIENT_ID,
                scope: this.GoogleDriveApi.SCOPES,
                callback: (response) => {
                    // This callback is triggered after the user selects their account in the popup
                    this.GoogleDriveExchangeCodeForToken(response);
                },
            });
            this.GoogleDriveApi.gisInited = true;
            this.GoogleDriveCheckAuthStatus();
        },

        // 3. This function is called by the callback in Step 2.
        // It takes the temporary code from Google and exchanges it for a real access token.
        async GoogleDriveExchangeCodeForToken(response) {
            console.log("Step 3: Exchanging authorization code for access token...");
            if (response.code) {
                try {
                    // Use GAPI to perform the code exchange
                    const { result } = await window.gapi.client.oauth2.token.exchangeCode({
                        'code': response.code,
                        'client_id': this.GoogleDriveApi.CLIENT_ID,
                        'redirect_uri': 'postmessage' // Use a standard value for web clients
                    });
                    
                    // Set the token for the GAPI client
                    window.gapi.client.setToken(result);
                    this.GoogleDriveApi.loggedin = true; // LOGIN IS SUCCESSFUL
                    console.log("Login Successful!");

                } catch (err) {
                    console.error("Error exchanging code for token:", err);
                }
            } else {
                console.error("Callback response did not contain a code:", response);
            }
        },
        
        // 4. Checks if both libraries are ready, then starts the login flow
        GoogleDriveCheckAuthStatus() {
            if (this.GoogleDriveApi.gapiInited && this.GoogleDriveApi.gisInited) {
                console.log("Step 4: Both clients initialized, starting auth flow...");
                this.GoogleDriveAuthStart();
            }
        },

        // 5. This is now very simple: it just asks our new code client to request a code.
        async GoogleDriveAuthStart() {
            console.log("Step 5: Requesting authorization code from user...");
            if (this.GoogleDriveApi.tokenClient) {
                this.GoogleDriveApi.tokenClient.requestCode();
            } else {
                console.error("Token client is not initialized.");
            }
        },

        // The rest of the functions for SignOut, ListFiles, etc., remain the same
        // as they rely on the GAPI client which is now correctly authorized.
        GoogleDriveSignOut() {
            const token = window.gapi.client.getToken();
            if (token !== null) {
                window.google.accounts.oauth2.revoke(token.access_token);
                window.gapi.client.setToken('');
                this.GoogleDriveApi.loggedin = false
                this.$root.$data.popup.name = null
            }
        },

        async GoogleDriveListFiles() {
            // This function does not need to change
            this.GoogleDriveApi.searching = true
            console.log("GoogleDriveListFiles")
            let response;
            try {
                response = await window.gapi.client.drive.files.list({
                    'pageSize': 10,
                    'fields': 'files(id, name, size,  modifiedTime)',
                    'q': "name contains '.wm4'"
                });
            } catch (err) {
                console.log(err.message);
                return;
            }
            const files = response.result.files;
            if (!files || files.length == 0) {
                console.log('No files found.');
                return;
            }
            this.GoogleDriveApi.files = files
            this.GoogleDriveApi.searching = false
        },
        
        GoogleDriveReadFile() {
            // This function does not need to change
            var request = window.gapi.client.drive.files.get({
                fileId: this.GoogleDriveApi.CURRENT_FILE_OBJ.id,
                alt: 'media'
            })
            request.then(async (response) => {
                const mydata = new Blob([response.body], {
                    type: "text/json;charset=utf-8",
                });
                await this.$root.databaseImport(mydata)
                this.$root.getSettings()
            }, function (error) {
                console.error(error)
            })
            this.$root.$data.popup.name = null
            return request;
        },
        
        async GoogleDriveWriteFile(callback) {
            // This function does not need to change
            this.GoogleDriveApi.loading = true;
            this.GoogleDriveApi.CURRENT_FILE_NAME = this.$root.session.settings.ProjectName
            let blob = await this.$root.databaseExport()
            let CURRENT_FILE_CONTENTS = await blob.text()
            var filePath = "";
            if (this.GoogleDriveApi.CURRENT_FILE_OBJ) {
                filePath = this.GoogleDriveApi.CURRENT_FILE_OBJ.id;
            }
            const boundary = '-------314159265358979323846';
            const delimiter = "\r\n--" + boundary + "\r\n";
            const close_delim = "\r\n--" + boundary + "--";
            const contentType = 'application/json';
            var metadata = { 'name': this.GoogleDriveApi.CURRENT_FILE_NAME + '.wm4', 'mimeType': contentType };
            var multipartRequestBody = delimiter + 'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) + delimiter + 'Content-Type: ' + contentType + '\r\n\r\n' + CURRENT_FILE_CONTENTS + close_delim;
            var request
            if (filePath == "") {
                request = window.gapi.client.request({
                    'path': '/upload/drive/v3/files',
                    'method': 'POST',
                    'params': {
                        'uploadType': 'multipart'
                    },
                    'headers': {
                        'Content-Type': 'multipart/related; boundary="' + boundary + '"'
                    },
                    'body': multipartRequestBody
                });
            } else {
                request = window.gapi.client.request({
                    'path': '/upload/drive/v3/files/' + filePath,
                    'method': 'PATCH',
                    'params': {
                        'uploadType': 'multipart'
                    },
                    'headers': {
                        'Content-Type': 'multipart/related; boundary="' + boundary + '"'
                    },
                    'body': multipartRequestBody
                });
            }
            if (!callback) {
                callback = (file) => {
                    this.GoogleDriveApi.CURRENT_FILE_OBJ = file;
                    this.GoogleDriveApi.loading = false;
                    this.$root.$data.popup.name = null
                };
            }
            request.execute(callback);
        },
    },
}
export default GoogleDriveApi