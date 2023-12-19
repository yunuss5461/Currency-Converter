const apiKey = '8eed915b43333670323a8e20'; 


function fetchCurrencies() {
  const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('API isteğinde hata oluştu: ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      populateCurrencySelectors(data.conversion_rates);
    })
    .catch((error) => {
      console.error('Hata:', error);
      alert('Döviz kurları yüklenirken bir hata oluştu.');
    });
}


function populateCurrencySelectors(rates) {
  const fromCurrencySelect = document.getElementById('from-currency');
  const toCurrencySelect = document.getElementById('to-currency');

  fromCurrencySelect.innerHTML = '';
  toCurrencySelect.innerHTML = '';

  Object.keys(rates).forEach((currency) => {
    fromCurrencySelect.innerHTML += `<option value="${currency}">${currency}</option>`;
    toCurrencySelect.innerHTML += `<option value="${currency}">${currency}</option>`;
  });
}


function convertCurrency() {
  const amount = document.getElementById('amount').value;
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;

  if (!amount || !fromCurrency || !toCurrency) {
    document.getElementById('result').innerText =
      'Lütfen tüm alanları doldurun.';
    return;
  }

  const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const rate = data.conversion_rates[toCurrency];
      if (rate) {
        const result = amount * rate;
        document.getElementById(
          'result'
        ).innerText = `${amount} ${fromCurrency} = ${result.toFixed(
          2
        )} ${toCurrency}`;
      } else {
        document.getElementById('result').innerText = 'Dönüşüm hatası!';
      }
    })
    .catch((error) => {
      console.error('Dönüşüm Hatası:', error);
      document.getElementById('result').innerText = 'Dönüşüm hatası!';
    });
}


document.addEventListener('DOMContentLoaded', function () {
  fetchCurrencies();
  document
    .getElementById('convert-button')
    .addEventListener('click', convertCurrency);
  document.getElementById('amount').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      convertCurrency();
    }
  });
});
