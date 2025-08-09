const { exportHealthConnectToAppleHealthXML } = require('./export-healthconnect-apple-xml.v5.1');

// Beispiel: Health Connect Daten aus nativer Kotlin-Bridge oder Plugin holen
async function runExport() {
  // records muss ein Array aller freigegebenen Health Connect Datensätze sein
  const records = await getAllHealthConnectRecordsFromPlugin();

  // XML exportieren
  const appleXML = exportHealthConnectToAppleHealthXML(records);

  console.log(appleXML);
  // Jetzt kann das XML z. B. als Datei gespeichert oder weiterverarbeitet werden
}

runExport().catch(console.error);
