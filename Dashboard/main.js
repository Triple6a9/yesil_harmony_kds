function updateDateTime() {
  const datetimeElement = document.getElementById('datetime');
  const now = new Date();

  // Tarih ve saat formatlama
  const formattedDate = now.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = now.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  datetimeElement.textContent = `${formattedDate} ${formattedTime}`;
}
  
// Her saniyede güncelle
setInterval(updateDateTime, 1000);
  
// Sayfa yüklendiğinde başlat
updateDateTime();

async function degisimOranlariniGetir(alanID) {
  const response = await fetch(`/degisim-oranlari?alanID=${alanID}`);
  return response.json();
}

