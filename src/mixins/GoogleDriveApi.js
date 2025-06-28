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
        GoogleDriveSignIn() {
            // Use an arrow function to preserve 'this' context, which fixes the previous TypeError
            window.gapi.load('client', () => this.GoogleDriveInitializeGapi());
            this.GoogleDriveInitializeGisClient();
        },

        async GoogleDriveInitializeGapi() {
            await window.gapi.client.init({
                apiKey: this.GoogleDriveApi.API_KEY,
                discoveryDocs: [this.GoogleDriveApi.DISCOVERY_DOC],
            });
            
            // This line is correct and necessary. It loads the helper for token exchange.
            await window.gapi.client.load('oauth2', 'v2');
            
            this.GoogleDriveApi.gapiInited = true;
        },

        GoogleDriveInitializeGisClient() {
            this.GoogleDriveApi.tokenClient = window.google.accounts.oauth2.initCodeClient({
                client_id: this.GoogleDriveApi.CLIENT_ID,
                scope: this.GoogleDriveApi.SCOPES,
                callback: (response) => {
                    if (response.code) {
                        // THIS IS THE CORRECTED SECTION
                        // We use the gapi.client.oauth2.token.exchangeCode helper function
                        // instead of a manual XMLHttpRequest.
                        window.gapi.client.oauth2.token.exchangeCode({
                            'code': response.code,
                            'client_id': this.GoogleDriveApi.CLIENT_ID,
                            'redirect_uri': 'postmessage' // This is the correct value for this flow
                        }).then((tokens) => {
                            // The exchange was successful
                            console.log("Token exchange successful!", tokens);
                            window.gapi.client.setToken(tokens.result);
                            this.GoogleDriveApi.loggedin = true;
                            console.log("Login Complete!");
                        }).catch((err) => {
                            console.error("Error during token exchange:", err);
                        });
                    } else {
                        console.error("Error: No authorization code received.", response);
                    }
                },
            });
            this.GoogleDriveApi.gisInited = true;
        },

        GoogleDriveAuthStart() {
            // We trigger the popup only after GAPI is fully initialized.
            if (this.GoogleDriveApi.gapiInited) {
                this.GoogleDriveApi.tokenClient.requestCode();
            } else {
                // If GAPI isn't ready, wait a moment and try again.
                // This prevents race conditions.
                setTimeout(() => this.GoogleDriveAuthStart(), 100);
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

async GoogleDriveListFiles() {
            this.GoogleDriveApi.searching = true
            console.log("GoogleDriveListFiles")
            let response;
            try {
                response = await window.gapi.client.drive.files.list({
                    'pageSize': 10,
                    'fields': 'files(id, name, size,  modifiedTime)',
                    'q': "name contains '.wm4'"
                });
            } catch (err) {
                console.log(err.message);
                return;
            }
            const files = response.result.files;
            if (!files || files.length == 0) {
                console.log('No files found.');
                this.GoogleDriveApi.files = []; // Ensure it's an empty array
                this.GoogleDriveApi.searching = false;
                return;
            }
            this.GoogleDriveApi.files = files
            this.GoogleDriveApi.searching = false
        },
        GoogleDriveReadFile() {
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
            this.GoogleDriveApi.loading = true;
            this.GoogleDriveApi.CURRENT_FILE_NAME = this.$root.session.settings.ProjectName;
            let blob = await this.$root.databaseExport();
            let CURRENT_FILE_CONTENTS = await blob.text();
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
            var request;

            if (filePath == "") {
                request = window.gapi.client.request({
                    'path': '/upload/drive/v3/files',
                    'method': 'POST',
                    'params': { 'uploadType': 'multipart' },
                    'headers': { 'Content-Type': 'multipart/related; boundary="' + boundary + '"' },
                    'body': multipartRequestBody
                });
            } else {
                request = window.gapi.client.request({
                    'path': '/upload/drive/v3/files/' + filePath,
                    'method': 'PATCH',
                    'params': { 'uploadType': 'multipart' },
                    'headers': { 'Content-Type': 'multipart/related; boundary="' + boundary + '"' },
                    'body': multipartRequestBody
                });
            }

            if (!callback) {
                callback = (file) => {
                    this.GoogleDriveApi.CURRENT_FILE_OBJ = file.result;
                    this.GoogleDriveApi.loading = false;
                    this.$root.$data.popup.name = null;
                };
            }
            request.execute(callback);
        }  
    }
}
export default GoogleDriveApi