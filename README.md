# ChemnitzAngular

## Development server

To start a local development server, run:

```bash
ng serve
```
or
```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

To access the app through your local network:
```bash
ng serve --host "0.0.0.0" --port 4200
```
This will start the development server and bind it to all network interfaces, making the app accessible on your local network. Open your browser and navigate to `http://localhost:4200` or http://<your-local-ip>:4200.
> Note: For access through your local network, you need to change a host in apiUrl on the line 30 in api.service.ts file.


## Build for Production

To build the project run:

```bash
ng build
```

This will compile the project and store the build artifacts in the `dist/` directory.
