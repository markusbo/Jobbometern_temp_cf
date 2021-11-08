let writeFile = require('file-system').writeFile;

// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';
// Load node modules
require('dotenv').config();
// `environment.ts` file structure
const envConfigFile = `export const environment = {
    employersApi: "${process.env.EMPLOYERS_API}",
    jobsearchApi: "${process.env.JOBSEARCH_API}",
    jobsearchApiKey: "${process.env.JOBSEARCH_APIKEY}",
    production: ${process.env.PRODUCTION},
    employerApiAccessPassword: "${process.env.EMPLOYER_API_ACCESS_PASSWORD}",
    tlsSubDomainName: "${process.env.TSL_SUB_DOMAIN_NAME}",
    forceBrandingMode: "${process.env.FORCE_BRANDING_MODE}"
};
`;
console.log('The file `environment.ts` will be written with the following content: \n');
console.log(envConfigFile);
writeFile(targetPath, envConfigFile, function (err) {
   if (err) {
       throw console.error(err);
   } else {
       console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
   }
});