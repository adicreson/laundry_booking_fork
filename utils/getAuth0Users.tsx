

export class getUsers {

    private token: Promise<string>

    constructor() {
        this.token = this.setAuth0Token()
    }


    private async setAuth0Token() {
        const id = (process.env.REACT_APP_ID as string)
        const secret = (process.env.REACT_APP_SECRET as string)

        const options = {
            method: 'POST',
            url: 'https://dev-otg4ju0e.us.auth0.com/oauth/token',
            headers: { 'content-type': 'application/json' },
            body: `{"client_id" : "${id}", "client_secret": "${secret}", "audience" : "https://dev-otg4ju0e.us.auth0.com/api/v2/", "grant_type" : "client_credentials"}`,
        }
        const response = await fetch(options.url, options)
        const responseJson = await response.json()
        const parsed = await responseJson.access_token

        return parsed

    }

    private downloadJSON = (json: String) => {


        const dataStr = 'data:application/json;charset=utf-8,' + json
        const download = document.createElement('a')
        download.setAttribute('href', dataStr)
        download.setAttribute('download', 'Användare' + '.json')
        document.body.appendChild(download)
        download.click()
        download.remove()

    }

    private async _downloadAllUsers() {

        const token = await this.token
        const options = {
            method: 'GET',
            url: 'https://dev-otg4ju0e.us.auth0.com/api/v2/users',
            headers: { authorization: 'Bearer ' + token }
        }
        const response = await fetch(options.url, options)
        const data = await response.json()
        const parsed = JSON.stringify(data)


        this.downloadJSON(parsed)
    }

    private async _getSpecificUser(key: string, value: string) {

        const token = await this.token
        const specified = `${key} : "${value}"`
        const options = {
            method: 'GET',
            url: 'https://dev-otg4ju0e.us.auth0.com/api/v2/users?',
            headers: { authorization: 'Bearer ' + token }
        }

        const searchParams = new URLSearchParams({
            q: specified,
            search_engine: 'v3',
        })
        const response = await fetch(options.url + searchParams.toString(), options)
        const data = await response.json()
        const parser = JSON.parse(JSON.stringify(data))

        return parser[0]

    }

    private async _checkForPrivliges(key: string, value: string) {
        const currentUser = await this._getSpecificUser(key, (value as string))
        const getDev: boolean = currentUser.app_metadata.isDev
        let isDev = false
        switch (getDev) {
            case true:
                isDev = true
                break;
        }
        return isDev
    }

    get downloadAllUsers() {
        return this._downloadAllUsers()
    }

    async getPrivileges(key: string, value: string) {
        // let priv = false
        // this._checkForPrivliges(key, value).then(bool => {
        //     if (bool) {
        //         priv = true
        //     }
        // })
        // return priv
        return this._checkForPrivliges(key, value)
    }

    getSpecificUser(key: string, value: string) {
        if (!key || !value) {
            return
        }
        return this._getSpecificUser(key, value)
    }


}