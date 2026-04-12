function scanAndReplace(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      if (obj[key].startsWith('data:image/') || obj[key].startsWith('blob:')) {
        console.log(`Found asset at ${key}: ${obj[key].substring(0, 50)}...`);
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      scanAndReplace(obj[key]);
    }
  }
}
scanAndReplace({ nodes: [{ data: { outputImage: "data:image/png;base64,iVBOR", arr: ["blob:http://localhost"] } }] });
