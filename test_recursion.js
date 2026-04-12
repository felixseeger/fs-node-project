const processAssetsInObject = async (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const result = JSON.parse(JSON.stringify(obj));
  const uploadPromises = [];

  const traverse = (current, key, parent) => {
    if (typeof current === 'string') {
      if (current.startsWith('blob:') || current.startsWith('data:image/')) {
        const promise = Promise.resolve('https://firebasestorage/' + key).then((url) => {
          parent[key] = url;
        });
        uploadPromises.push(promise);
      }
    } else if (current && typeof current === 'object') {
      for (const k in current) {
        if (Object.prototype.hasOwnProperty.call(current, k)) {
          traverse(current[k], k, current);
        }
      }
    }
  };

  for (const k in result) {
    if (Object.prototype.hasOwnProperty.call(result, k)) {
      traverse(result[k], k, result);
    }
  }

  await Promise.all(uploadPromises);
  return result;
};

processAssetsInObject({ nodes: [{ data: { img: "data:image/123", num: 1 } }] }).then(res => console.dir(res, { depth: null }));
