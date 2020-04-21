addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let api = `https://cfw-takehome.developers.workers.dev/api/variants`;
  let result = await fetch(api);
  let variants = (await result.json()).variants;
  let url;
  if (Math.random() < 0.5) {
    //if 0 < number < .4999 then go to webpage 1, else webpage 2, 50% change ensured
    url = variants[0];
  } else {
    url = variants[1];
  }
  let webpage = await fetch(url);
  webpage = new Response(webpage.body, webpage);
  let webpageCookie = webpage.cookie;
  console.log(webpageCookie);
  return new HTMLRewriter() //first part of extra credit, change HTML elements
    .on('title', new ChangeTitle())
    .on('h1#title', new ChangeH1())
    .on('p#description', new ChangeDescription())
    .on('a#url', new ChangeLink())
    .transform(webpage);
}

class ChangeTitle {
  //change title of webpage
  element(element) {
    element.setInnerContent('Redirected Webpage');
  }
}

class ChangeH1 {
  //change h1 element
  element(element) {
    element.setInnerContent('New Webpage');
  }
}

class ChangeDescription {
  //change description (p element)
  element(element) {
    element.setInnerContent('Below is a link to my github');
  }
}

class ChangeLink {
  //change link (a element)
  element(element) {
    element.setInnerContent('Go to my Github');
    element.setAttribute('href', 'https://github.com/abhriguvansh');
  }
}
