# API
  
Examples for setting up an API with data from Employer dataset.

## API implemented as a cloudflare worker
  
### Prepare  
  
1. Install wrangler and login.
```shell  
user:~$ npm i @cloudflare/wrangler -g
user:~$ wrangler login
```  
2. Add your account id to the configuration file `wrangler.toml` and create a new KV namespace named EMPLOYER.
```shell
user:~$ wrangler kv:namespace create "EMPLOYER"
```
This will output a namespace id `{ binding = "EMPLOYER", id = "..." }`.

3. Add your namespace id to the kv_namespaces array in `wrangler.toml`.
```
kv_namespaces = [
{ binding = "EMPLOYER", id = "..." }
]
```

### Upload data

4. Make sure the the following files from Employer dataset are put in the `input/` directory: `table_employers.parquet`, `collections.parquet`.
5. Generate files with key-value pairs from the dataset files, run `python conversion_kv.py`. The files will be saved in `upload/` and each file will contain max 10,000 key-value pairs. 
6. Upload the key-value pairs to your KV namespace
```shell 
user:~$ bash upload_cf.sh
```

### Start worker
7. Run `wrangler publish` to start the worker implemented in `index.js`.
