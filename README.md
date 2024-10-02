# Atlas App Services Schema Generator

## Description

This project facilitates the creation of dummy data based on an Atlas App Services schema. 

The idea is that with a `json` file that defines an [App Services schema](https://www.mongodb.com/docs/atlas/app-services/schemas/), random data can be created to simulate example documents in a given collection. 

## Installation

You need to install the packages dependencies by running: 

```bash
npm install 
```

And executing it by running: 

```bash
npm run start
```

However, you can create a binary file for MacOS Silicon or Windows to use it from your terminal by running the following command:

* For Windows machines:

```bash
npm run build_win
```

* For MacOS Silicon 

```bash
npm run build_arm
```

This will generate a binary with NodeJS 16. If you need a different distribution you can use `pkg` to create one you need.

The above command will generate a file in the `bin` directory with: 

1. `realm-schema-generator` compiled with NodeJS 16 for Apple Silicon. 
2. `realm-schema-generator.exe` compiled with NodeJS 16 for Microsoft Windows. 

## Usage

Once the application is running, you can specify the options and commands to generate random data based on your Atlas App Services schema. Refer to the "Options" and "Commands" sections for more details.

### Options

```bash
--version  Show version number                                       [boolean]
--help     Show help                                                 [boolean]
```

The `--help` options command will show how to use the tool and what parameters there are avaiable.

### Commands

```bash
generate [schema]  Generate data
```

The `generate` command will create documents based on a `json` schema definition file. In order to use the command a `/path/to/file.json` must be provided next to the `generate` command. 

The available `Options` are 

```bash
--number   Number of documents to generate    [number] [required] [default: 1]
--uri      MongoDB Atlas conection URI with username and password     [string]
--col      Atlas Collection name                                      [string]
--db       Atlas Database name                                        [string]
```

If a `--uri` is not provided, an `output.json` file will be created with the example documents. When a `--uri` is provided, then a `--col` and `--db` is mandatory. This will create the `database` and `collection` in your Atlas cluster for the documents. 

## Examples

* Creating 100 samples documents locally: 
  ```bash
  bin/realm-schema-generator generate --number 100 files/example.json
  ```

* Creating 1000 documents in a `test` database and `schema` collection in Atlas:
  ```bash
  bin/realm-schema-generator generate files/example.json --number 100 --uri mongodb+srv://<user>:<password>@<cluster>.mongodb.net --db test --col schema 
  ```

## Contributing

We welcome contributions from the community! If you have any ideas, bug fixes, or feature requests, please feel free to open an issue or submit a pull request. We appreciate your help in making this project even better.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.