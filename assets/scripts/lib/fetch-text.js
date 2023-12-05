const FetchText = async (url) => {
  const req = await fetch(url);
  const res = await req.text();

  return res;
};

export default FetchText;
