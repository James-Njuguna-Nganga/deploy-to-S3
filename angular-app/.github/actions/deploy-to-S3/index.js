const core = require('@actions/core'); // Get inputs and set outputs
const exec = require('@actions/exec'); // Interact with the CLI

async function run() {
  try {
    // Get inputs from the GitHub Actions workflow
    const bucket = core.getInput('bucketName', { required: true });
    const bucketRegion = core.getInput('bucketRegion', { required: true });
    const distFiles = core.getInput('distFiles', { required: true });

    console.log(`Deploying to S3 bucket: ${bucket} in ${bucketRegion}`);

    // S3 sync command
    const s3Url = `s3://${bucket}`;
    await exec.exec(`aws s3 sync ${distFiles} ${s3Url} --region ${bucketRegion}`);

    // Construct the website URL
    const websiteURL = `http://${bucket}.s3-website-${bucketRegion}.amazonaws.com`;
    core.setOutput("URL", websiteURL);

    console.log(`Deployment successful! Access your site at: ${websiteURL}`);
  } catch (error) {
    core.setFailed(`Deployment failed: ${error.message}`);
  }
}

run();
