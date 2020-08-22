const form = document.querySelector('#form');
const url = document.querySelector('#url');
const slug = document.querySelector('#slug');
const result = document.querySelector('.result');

const src = 'https://stuh.herokuapp.com/';

const createHTML = (data) => {
  if (data.error) {
    return `<div>${data.error}</div>`;
  } else {
    return `
            <div>Your slug: ${data.slug}</div>
            <div>Your url: <a href="${data.url}" target="_blank" >${data.url}</a></div>
            <div>Here is your shorten url: <a href="/${data.slug}" target="_blank" >stuh.herokuapp.com/${data.slug}</a> </div>
            `;
  }
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const response = await fetch(`${src}url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url.value,
      slug: slug.value || undefined,
    }),
  });

  if (response.status === 200) {
    const data = await response.json();

    result.innerHTML = createHTML(data);
  } else if (response.status === 400) {
    const data = await response.json();

    result.innerHTML = createHTML(data);
  }

  url.value = '';
  slug.value = '';
});
