# Ghost Cloudflare R2 Storage Adapter

A simple custom storage adapter to add Cloudflare R2 object storage support for Ghost through S3 API.


## Installation

Create a `storage` directory inside your Ghost installation's `content/adapters/storage` folder.

```bash
mkdir /path/your/ghost/installation/content/adapters/storage
```

### Using NPM

* Install the package.
    ```bash
    cd /path/your/ghost/installation/content/adapters/storage
    npm install ghost-cloudflare-r2-storage
    ```
* Go to [configuration section](#configuration) and configure the adapter.

### Using Git

* Clone the repository.
    ```bash
    cd /path/your/ghost/installation/content/adapters/storage
    git clone https://github.com/ronilsonalves/ghost-cloudflare-r2-storage.git
    ```
* Cd to the cloned repository and install the dependencies.
    ```bash
    cd ghost-cloudflare-r2-storage
    npm install --production
    ```
* Go to [configuration section](#configuration) and configure the adapter.

## Configuration
Add the storage json object to your `config.env.json`'s Ghost installation.

```json
"storage": {
    "active": "ghost-cloudflare-r2-storage",
    "ghost-cloudflare-r2-storage": {
        "bucket": "<YOUR_BUCKET_NAME>",
        "endpoint": "<YOUR_ACCOUNT_ID>.r2.cloudflarestorage.com",
        "accessKeyId": "<YOUR_ACCESS_KEY_ID>",
        "secretAccessKey": "<YOUR_SECRET_ACCESS_KEY>",
        "publicDomain": "https://subdomaintohostfiles.yourdomain.com"
    }
}
```

Just replace the values with your own and restart Ghost.
```bash
ghost restart
```

Note 1: The `publicDomain` is required, if you don't provide it, the adapter will use the `endpoint` value that isn't public accessible and will cause the images to not load.

Note 2: Don't add the `https://` to the `endpoint` value.

Note 3: Don't add at the end of the `endpoint` and `publicDomain` value the `/` character.

## FAQ's
### **Q:** I'm facing a permission error when I try to restart Ghost after configure the adapter. What should I do?

**A:** Problably during the installation you used `sudo` to install the adapter, so the files are owned by root. To fix this, just change the owner of the files to the user that runs Ghost.

```bash
sudo chown -R ghost:ghost /path/your/ghost/installation/content/adapters/storage/ghost-cloudflare-r2-storage
```
Or you can use the ghost-cli to fix the permissions. Just run the command below inside your Ghost installation directory and follow the provided instructions. **Note**: Ensure that you have stopped Ghost before run the command.

```bash
ghost doctor
```

## License
Please see the [license file](LICENSE) for more information.