const GoogleDriveApi = {
    data() {
        return {
            GoogleDriveApi: {
                CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
                DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
                SCOPES: 'https://www.googleapis.com/auth/drive.file',
                tokenClient: null,
                loggedin: false,
                files: [],
                CURRENT_FILE_OBJ: null,
                CURRENT_FILE_NAME: "",
                CURRENT_FILE_CONTENTS: "",
                loading: false,
                searching: false,
            }
        }
    },
    methods: {
        // This is the ONLY function the login button should call.
        // It is self-contained and ensures everything happens in the correct order.
        async GoogleDriveSignIn() {
            console.log("Starting final, corrected sign-in flow...");

            // 1. Ensure the main GAPI client and the oauth2 helper are loaded and ready.
            try {
                await new Promise((resolve, reject) => {
                    // Load the 'client' library. The callback initializes it.
                    window.gapi.load('client', () => {
                        window.gapi.client.init({
                            apiKey: this.GoogleDriveApi.API_KEY,
                            discoveryDocs: [this.GoogleDriveApi.DISCOVERY_DOC],
                        })
                        // After init, also load the specific oauth2 library needed for token exchange
                        .then(() => window.gapi.client.load('oauth2', 'v2'))
                        .then(resolve) // Mark the promise as resolved
                        .catch(reject); // Mark the promise as rejected if any step fails
                    });
                });
                console.log("GAPI client and GAPI-OAuth2 helper are ready.");
            } catch (err) {
                console.error("Error initializing GAPI client:", err);
                return; // Stop if GAPI fails
            }

            // 2. Initialize the GIS Code Client for the pop-up flow.
            // filepath: [GoogleDriveApi.js](http://_vscodecontentref_/3)
            const tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: this.GoogleDriveApi.CLIENT_ID,
                scope: this.GoogleDriveApi.SCOPES,
                callback: (response) => {
                    if (response.access_token) {
                        window.gapi.client.setToken({ access_token: response.access_token });
                        this.GoogleDriveApi.loggedin = true;
                        console.log("Token set successfully! Login Complete!");
                    } else {
                        console.error("Error: No access token received.", response);
                    }
                },
            });
            tokenClient.requestAccessToken();
        },

        // This function signs the user out.
        GoogleDriveSignOut() {
            const token = window.gapi.client.getToken();
            if (token !== null) {
                window.google.accounts.oauth2.revoke(token.access_token);
                window.gapi.client.setToken('');
                this.GoogleDriveApi.loggedin = false
                this.$root.$data.popup.name = null
            }
        },

        // This function lists the user's .wm4 files from Google Drive.
        async GoogleDriveListFiles() {
            this.GoogleDriveApi.searching = true;
            console.log("GoogleDriveListFiles");
            let response;
            try {
                response = await window.gapi.client.drive.files.list({
                    'pageSize': 10,
                    'fields': 'files(id, name, size, modifiedTime)',
                    'q': "name contains '.wm4'"
                });
            } catch (err) {
                console.error("Error listing files:", err);
                this.GoogleDriveApi.searching = false;
                return;
            }
            const files = response.result.files;
            if (!files || files.length == 0) {
                console.log('No files found.');
                this.GoogleDriveApi.files = [];
            } else {
                this.GoogleDriveApi.files = files;
            }
            this.GoogleDriveApi.searching = false;
        },

        // This function reads the content of a selected file.
        GoogleDriveReadFile() {
            var request = window.gapi.client.drive.files.get({
                fileId: this.GoogleDriveApi.CURRENT_FILE_OBJ.id,
                alt: 'media'
            });
            request.then(async (response) => {
                const mydata = new Blob([response.body], {
                    type: "text/json;charset=utf-8",
                });
                await this.$root.databaseImport(mydata);
                this.$root.getSettings();
            }, function(error) {
                console.error("Error reading file:", error);
            });
            this.$root.$data.popup.name = null;
            return request;
        },

        // This function saves (creates or updates) a file.
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
export default GoogleDriveApi;