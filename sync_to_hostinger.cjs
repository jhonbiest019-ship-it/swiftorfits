const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

async function syncToHostingerLive() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log('Connecting to Hostinger FTP (145.79.28.60) for www.swiftorbits.com...');
    await client.access({
      host: '145.79.28.60',
      user: 'u756068814',
      password: 'Amazoon@1+=',
      port: 21,
      secure: false
    });
    console.log('✓ Successfully authenticated to Hostinger FTP!');

    const targetRemotePath = 'domains/swiftorbits.com/public_html';
    console.log(`Navigating to ${targetRemotePath}...`);
    await client.cd(targetRemotePath);
    console.log('Current remote working directory:', await client.pwd());

    const sourceDir = path.resolve(__dirname, 'ready_for_hostinger');

    // 1. Upload updated index.html
    const localIndexPath = path.join(sourceDir, 'index.html');
    if (fs.existsSync(localIndexPath)) {
      console.log('Uploading clean index.html to live www.swiftorbits.com...');
      await client.uploadFrom(localIndexPath, 'index.html');
      console.log('✓ index.html uploaded successfully!');
    } else {
      throw new Error(`index.html not found in ${sourceDir}`);
    }

    // 2. Upload latest assets bundle
    const assetsDir = path.join(sourceDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      console.log('Synchronizing assets directory to www.swiftorbits.com...');
      await client.uploadFromDir(assetsDir, 'assets');
      console.log('✓ assets synchronized successfully!');
    }

    // 3. Verify on live server
    console.log('\n--- Verifying Live index.html on Hostinger ---');
    const remoteList = await client.list();
    const remoteIndex = remoteList.find(item => item.name === 'index.html');
    if (remoteIndex) {
      console.log(`Verified live index.html: Size = ${remoteIndex.size} bytes, Modified = ${remoteIndex.rawModifiedAt}`);
    }

    console.log('\n======================================================');
    console.log('🎉 SUCCESS: www.swiftorbits.com updated directly on Hostinger!');
    console.log('======================================================');
  } catch (err) {
    console.error('FTP Sync Error:', err);
    process.exit(1);
  } finally {
    client.close();
  }
}

syncToHostingerLive();
