import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput, Image, Linking } from 'react-native';

const LANG = {
  pashto: { appTitle: 'Afghan VIP Map', appTitle2: 'د افغان وي آی پي نقشه', subtitle: 'Full Afghanistan - Every City, Village, Street', map: 'MAP / نقشه', driver: 'DRIVER / چلوونکی', help: 'HELP / مرسته', searchHint: 'Search City, Village, Street... / ښار، کلی، کوڅه وپلټئ...', searchBtn: 'Search / پلټنه', openBtn: 'Open Full Map / بشپړه نقشه پرانیزه', car: 'Car / موټر', walk: 'Walk / پښې', helpTitle: 'HELP AI / مرسته', helpText: 'Salaam! / سلام! Where do you want to go? / چیرته ځئ؟ Write any city, village or street name in Afghanistan. / په افغانستان کې د هر ښار، کلي یا کوڅې نوم ولیکئ.', selectCity: 'Quick Go To / ژر ځه:', driverTitle: 'Verified Drivers / تایید شوي چلوونکي', joinBtn: 'Join as Driver / د چلوونکي په توګه یوځای شئ', driverNote: 'Driver will not select himself - First we verify - CNIC + Photo / چلوونکی به خپله نه ټاکل کیږي - لومړی موږ تایید کوو - CNIC + عکس', verified: '✅ VERIFIED', pending: '⏳ PENDING VERIFY', call: 'Call / زنګ', nameHint: 'Your Name / ستاسو نوم', cityHint: 'Your City / ستاسو ښار - Kabul, Herat...', carHint: 'Your Car / ستاسو موټر - Corolla, Land Cruiser...', phoneHint: 'Phone / ټیلیفون - 0700...', cnicHint: 'CNIC Number / د CNIC شمیره', submit: 'Submit for Verification / د تایید لپاره وسپارئ', allCities: 'All Cities / ټول ښارونه', noDriver: 'No verified driver in this city yet / په دې ښار کې لا تایید شوی چلوونکی نشته', routeTitle: 'How do you want to go? / څنګه ځئ؟', routeCar: 'By Car - Fast', routeWalk: 'On Foot - Walk', driverSearchHint: 'Search Driver, City, Car... / چلوونکی، ښار، موټر وپلټئ...' },
  dari: { appTitle: 'Afghan VIP Map', appTitle2: 'نقشه وی آی پی افغان', subtitle: 'Full Afghanistan - Every City, Village, Street', map: 'MAP / نقشه', driver: 'DRIVER / راننده', help: 'HELP / کمک', searchHint: 'Search City, Village, Street... / شهر، قریه، کوچه را جستجو کن...', searchBtn: 'Search / جستجو', openBtn: 'Open Full Map / نقشه کامل را باز کن', car: 'Car / موتر', walk: 'Walk / پیاده', helpTitle: 'HELP AI / کمک', helpText: 'Salaam! / سلام! Where do you want to go? / کجا می خواهی بروی؟ Write any city, village or street name in Afghanistan. / نام هر شهر، قریه یا کوچه را در افغانستان بنویس.', selectCity: 'Quick Go To / زود برو به:', driverTitle: 'Verified Drivers / راننده های تایید شده', joinBtn: 'Join as Driver / به عنوان راننده بپیوندید', driverNote: 'Driver will not select himself - First we verify - CNIC + Photo / راننده خودش انتخاب نمی شود - اول ما تایید می کنیم - CNIC + عکس', verified: '✅ VERIFIED', pending: '⏳ PENDING VERIFY', call: 'Call / زنگ', nameHint: 'Your Name / نام شما', cityHint: 'Your City / شهر شما - Kabul, Herat...', carHint: 'Your Car / موتر شما - Corolla, Land Cruiser...', phoneHint: 'Phone / تلفن - 0700...', cnicHint: 'CNIC Number / شماره CNIC', submit: 'Submit for Verification / برای تایید بفرستید', allCities: 'All Cities / همه شهرها', noDriver: 'No verified driver in this city yet / در این شهر هنوز راننده تایید شده نیست', routeTitle: 'How do you want to go? / چطور می خواهی بروی؟', routeCar: 'By Car - Fast', routeWalk: 'On Foot - Walk', driverSearchHint: 'Search Driver, City, Car... / راننده، شهر، موتر را جستجو کن...' },
  english: { appTitle: 'Afghan VIP Map', appTitle2: 'Afghan VIP Map', subtitle: 'Full Afghanistan - Every City, Village, Street', map: 'MAP', driver: 'DRIVER', help: 'HELP', searchHint: 'Search City, Village, Street...', searchBtn: 'Search', openBtn: 'Open Full Map', car: 'Car', walk: 'Walk', helpTitle: 'HELP AI', helpText: 'Salaam! Where do you want to go? Write any city, village or street name in Afghanistan.', selectCity: 'Quick Go To:', driverTitle: 'Verified Drivers', joinBtn: 'Join as Driver', driverNote: 'Driver will not select himself - First we verify - CNIC + Photo', verified: '✅ VERIFIED', pending: '⏳ PENDING VERIFY', call: 'Call', nameHint: 'Your Name', cityHint: 'Your City - Kabul, Herat...', carHint: 'Your Car - Corolla, Land Cruiser...', phoneHint: 'Phone - 0700...', cnicHint: 'CNIC Number', submit: 'Submit for Verification', allCities: 'All Cities', noDriver: 'No verified driver in this city yet', routeTitle: 'How do you want to go?', routeCar: 'By Car - Fast', routeWalk: 'On Foot - Walk', driverSearchHint: 'Search Driver, City, Car...' }
};

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function App() {
  const [tab, setTab] = useState('map');
  const [lang, setLang] = useState('pashto');
  const [mode, setMode] = useState('car');
  const [showHelp, setShowHelp] = useState(false);
  const [search, setSearch] = useState('');
  const [place, setPlace] = useState('Kabul, Afghanistan');
  const [lat, setLat] = useState(34.5553);
  const [lng, setLng] = useState(69.2075);
  const [zoom, setZoom] = useState(12);
  const [showRoute, setShowRoute] = useState(false);
  const L = LANG[lang];

  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Ahmad Khan', city: 'Kabul', car: 'Toyota Corolla 2022', phone: '0700123456', rating: '4.9', trips: 124, verified: true },
    { id: 2, name: 'Mohammad Rahim', city: 'Herat', car: 'Land Cruiser 2020', phone: '0799123456', rating: '4.8', trips: 98, verified: true },
    { id: 3, name: 'Karimullah', city: 'Kandahar', car: 'Hilux 2021', phone: '0706123456', rating: '5.0', trips: 210, verified: true },
    { id: 4, name: 'Farhad Jan', city: 'Mazar-e-Sharif', car: 'Corolla 2023', phone: '0791123456', rating: '4.7', trips: 65, verified: true },
    { id: 5, name: 'Najeebullah', city: 'Jalalabad', car: 'Corolla 2021', phone: '0703123456', rating: '4.9', trips: 88, verified: true },
    { id: 6, name: 'Hikmatullah', city: 'Kunduz', car: 'Land Cruiser 2019', phone: '0795123456', rating: '4.8', trips: 112, verified: true },
    { id: 7, name: 'Abdul Samad', city: 'Ghazni', car: 'Hilux 2022', phone: '0708123456', rating: '4.9', trips: 76, verified: true },
    { id: 8, name: 'Wahidullah', city: 'Khost', car: 'Corolla 2020', phone: '0778123456', rating: '4.6', trips: 54, verified: true },
  ]);
  const [filterCity, setFilterCity] = useState('All');
  const [driverSearch, setDriverSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [dName, setDName] = useState('');
  const [dCity, setDCity] = useState('');
  const [dCar, setDCar] = useState('');
  const [dPhone, setDPhone] = useState('');
  const [dCnic, setDCnic] = useState('');

  const cities = [
    { name: 'Kabul', lat: 34.5553, lng: 69.2075 },
    { name: 'Herat', lat: 34.3529, lng: 62.2040 },
    { name: 'Mazar-e-Sharif', lat: 36.7090, lng: 67.1109 },
    { name: 'Kandahar', lat: 31.6133, lng: 65.7100 },
    { name: 'Jalalabad', lat: 34.4265, lng: 70.4515 },
    { name: 'Kunduz', lat: 36.7289, lng: 68.8570 },
    { name: 'Bamyan', lat: 34.8255, lng: 67.8210 },
    { name: 'Ghazni', lat: 33.5456, lng: 68.4174 },
    { name: 'Khost', lat: 33.3396, lng: 69.9200 },
    { name: 'Badakhshan', lat: 37.0, lng: 70.8 },
  ];

  const goTo = (la, lo, name, z) => { setLat(la); setLng(lo); setPlace(name); setZoom(z || 13); setShowRoute(true); };

  const doSearch = async () => {
    if (!search) return;
    try {
      const q = encodeURIComponent(search + ', Afghanistan');
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`);
      const data = await res.json();
      if (data.length > 0) { goTo(parseFloat(data[0].lat), parseFloat(data[0].lon), data[0].display_name, 14); }
      else { Alert.alert('Not Found', search + ' not found.'); }
    } catch (e) { Alert.alert('Internet', 'Check internet and try again.'); }
  };

  const submitDriver = () => {
    if (!dName || !dCity || !dCar || !dPhone || !dCnic) { Alert.alert('Missing', 'Please fill all fields'); return; }
    const newDriver = { id: Date.now(), name: dName, city: dCity, car: dCar, phone: dPhone, rating: 'New', trips: 0, verified: false, cnic: dCnic };
    setDrivers([newDriver, ...drivers]);
    setDName(''); setDCity(''); setDCar(''); setDPhone(''); setDCnic('');
    setShowForm(false);
    Alert.alert('Submitted!', 'Your request is sent for verification.');
  };

  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=800x600&maptype=mapnik&markers=${lat},${lng},red-pushpin`;
  const openFull = () => { Linking.openURL(`https://www.openstreetmap.org/#map=${zoom}/${lat}/${lng}`); };

  const dist = getDistance(34.5553, 69.2075, lat, lng);
  const carMin = Math.max(5, Math.round(dist / 40 * 60));
  const walkMin = Math.max(10, Math.round(dist / 5 * 60));

  // Driver Search + Filter - dono ek sath chalenge
  const filtered = drivers.filter(d => {
    const matchCity = filterCity === 'All' || d.city.toLowerCase().includes(filterCity.toLowerCase());
    const q = driverSearch.toLowerCase().trim();
    const matchSearch = q === '' || d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q) || d.car.toLowerCase().includes(q);
    return matchCity && matchSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.langRow}>
          <TouchableOpacity onPress={() => setLang('pashto')} style={lang === 'pashto' ? styles.langActive : styles.lang}><Text style={styles.bold}>پښتو</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setLang('dari')} style={lang === 'dari' ? styles.langActive : styles.lang}><Text style={styles.bold}>دری</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setLang('english')} style={lang === 'english' ? styles.langActive : styles.lang}><Text style={styles.bold}>English</Text></TouchableOpacity>
        </View>
        <Text style={styles.logo}>{L.appTitle}</Text>
        <Text style={styles.logoPashto}>{L.appTitle2}</Text>
        <Text style={styles.sub}>{L.subtitle}</Text>
        <View style={styles.tabRow}>
          <TouchableOpacity onPress={() => setTab('map')} style={tab === 'map' ? styles.tabActive : styles.tab}><Text style={styles.tabText}>{L.map}</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('driver')} style={tab === 'driver' ? styles.tabActive : styles.tab}><Text style={styles.tabText}>{L.driver}</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setShowHelp(!showHelp)} style={styles.tab}><Text style={styles.tabText}>{L.help}</Text></TouchableOpacity>
        </View>
      </View>

      {showHelp && (<View style={styles.helpBox}><Text style={styles.bold}>{L.helpTitle}</Text><Text>{L.helpText}</Text></View>)}

      {tab === 'map' && (
        <ScrollView style={styles.flex}>
          <View style={styles.searchRow}>
            <TextInput value={search} onChangeText={setSearch} placeholder={L.searchHint} style={styles.inputFlex} />
            <TouchableOpacity onPress={doSearch} style={styles.searchBtn}><Text style={styles.bold}>{L.searchBtn}</Text></TouchableOpacity>
          </View>
          <Text style={styles.nowText}>Now Showing: {place}</Text>
          <Image source={mapUrl} style={styles.mapImg} resizeMode="cover" />
          {showRoute && (
            <View style={styles.routeBox}>
              <Text style={styles.routeTitle}>{L.routeTitle}</Text>
              <View style={styles.routeRow}>
                <TouchableOpacity onPress={() => setMode('car')} style={mode === 'car' ? styles.routeActive : styles.routeBtn}>
                  <Text style={styles.routeEmoji}>🚗</Text>
                  <Text style={styles.bold}>{L.car}</Text>
                  <Text style={styles.small}>{carMin} min • {dist.toFixed(1)} km</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMode('walk')} style={mode === 'walk' ? styles.routeActive : styles.routeBtn}>
                  <Text style={styles.routeEmoji}>🚶</Text>
                  <Text style={styles.bold}>{L.walk}</Text>
                  <Text style={styles.small}>{walkMin} min • {dist.toFixed(1)} km</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.routeInfo}>{mode === 'car' ? `✅ ${L.routeCar} - ${carMin} min` : `✅ ${L.routeWalk} - ${walkMin} min`}</Text>
            </View>
          )}
          <View style={styles.zoomRow}>
            <TouchableOpacity onPress={() => setZoom(zoom + 1)} style={styles.zoomBtn}><Text style={styles.bold}>+ Zoom In</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setZoom(Math.max(5, zoom - 1))} style={styles.zoomBtn}><Text style={styles.bold}>- Zoom Out</Text></TouchableOpacity>
            <TouchableOpacity onPress={openFull} style={styles.openBtn}><Text style={styles.whiteText}>{L.openBtn}</Text></TouchableOpacity>
          </View>
          <Text style={styles.bold2}>{L.selectCity}</Text>
          <View style={styles.cityWrap}>
            {cities.map(c => (
              <TouchableOpacity key={c.name} onPress={() => goTo(c.lat, c.lng, c.name, 12)} style={styles.cityBtn}><Text style={styles.bold}>{c.name}</Text></TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {tab === 'driver' && (
        <ScrollView style={styles.flex}>
          <Text style={styles.driverTitle}>{L.driverTitle}</Text>
          <Text style={styles.small}>{L.driverNote}</Text>
          <TouchableOpacity onPress={() => setShowForm(!showForm)} style={styles.joinBtn}><Text style={styles.whiteText}>{L.joinBtn} +</Text></TouchableOpacity>
          {showForm && (
            <View style={styles.form}>
              <TextInput value={dName} onChangeText={setDName} placeholder={L.nameHint} style={styles.input} />
              <TextInput value={dCity} onChangeText={setDCity} placeholder={L.cityHint} style={styles.input} />
              <TextInput value={dCar} onChangeText={setDCar} placeholder={L.carHint} style={styles.input} />
              <TextInput value={dPhone} onChangeText={setDPhone} placeholder={L.phoneHint} style={styles.input} keyboardType="phone-pad" />
              <TextInput value={dCnic} onChangeText={setDCnic} placeholder={L.cnicHint} style={styles.input} keyboardType="numeric" />
              <TouchableOpacity onPress={submitDriver} style={styles.submitBtn}><Text style={styles.whiteText}>{L.submit}</Text></TouchableOpacity>
            </View>
          )}

          <View style={styles.driverSearchBox}>
            <TextInput value={driverSearch} onChangeText={setDriverSearch} placeholder={L.driverSearchHint} style={styles.driverSearchInput} />
            {driverSearch !== '' && (
              <TouchableOpacity onPress={() => setDriverSearch('')} style={styles.clearBtn}><Text style={styles.bold}>X</Text></TouchableOpacity>
            )}
          </View>
          <Text style={styles.resultText}>{filtered.length} driver found</Text>

          <View style={styles.cityWrap}>
            <TouchableOpacity onPress={() => setFilterCity('All')} style={filterCity === 'All' ? styles.cityActive : styles.cityBtn}><Text style={styles.bold}>{L.allCities}</Text></TouchableOpacity>
            {cities.map(c => (
              <TouchableOpacity key={c.name} onPress={() => setFilterCity(c.name)} style={filterCity === c.name ? styles.cityActive : styles.cityBtn}><Text style={styles.bold}>{c.name}</Text></TouchableOpacity>
            ))}
          </View>

          {filtered.length === 0 && <Text style={styles.small}>{L.noDriver}</Text>}
          {filtered.map(d => (
            <View key={d.id} style={styles.driverCard}>
              <View style={styles.driverTop}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{d.name.charAt(0)}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{d.name}</Text>
                  <Text style={styles.driverCity}>{d.city} • ⭐ {d.rating} • {d.trips} trips</Text>
                  <Text style={styles.driverCar}>🚗 {d.car}</Text>
                </View>
              </View>
              <Text style={d.verified ? styles.verified : styles.pending}>{d.verified ? L.verified : L.pending}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${d.phone}`)} style={styles.callBtn}><Text style={styles.whiteText}>📞 {L.call} - {d.phone}</Text></TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  flex: { flex: 1, backgroundColor: 'white' },
  header: { backgroundColor: '#0A0A0A', padding: 14, paddingTop: 42, borderBottomWidth: 2, borderBottomColor: '#FFD700' },
  langRow: { flexDirection: 'row', marginBottom: 10 },
  lang: { backgroundColor: 'white', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, marginRight: 6 },
  langActive: { backgroundColor: '#FFD700', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, marginRight: 6 },
  logo: { color: '#FFD700', fontSize: 24, fontWeight: 'bold' },
  logoPashto: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  sub: { color: '#9CA3AF', fontSize: 12 },
  bold: { fontWeight: 'bold' },
  bold2: { fontWeight: 'bold', marginHorizontal: 10, marginTop: 10 },
  small: { fontSize: 12, color: '#555', margin: 2 },
  whiteText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  tabRow: { flexDirection: 'row', marginTop: 12 },
  tab: { backgroundColor: '#1F2937', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, marginRight: 6, borderWidth: 1, borderColor: '#333' },
  tabActive: { backgroundColor: '#FFD700', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, marginRight: 6 },
  tabText: { fontWeight: 'bold', fontSize: 12, color: 'white' },
  helpBox: { backgroundColor: '#FFFBEB', padding: 12, borderWidth: 1, borderColor: '#FFD700' },
  searchRow: { flexDirection: 'row', padding: 10 },
  input: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  inputFlex: { flex: 1, backgroundColor: '#F1F5F9', padding: 12, borderRadius: 12, marginRight: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  searchBtn: { backgroundColor: '#FFD700', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, justifyContent: 'center' },
  nowText: { fontWeight: 'bold', marginHorizontal: 10, marginBottom: 6 },
  mapImg: { width: '100%', height: 340, backgroundColor: '#E5E7EB' },
  zoomRow: { flexDirection: 'row', padding: 10 },
  zoomBtn: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, marginRight: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  openBtn: { backgroundColor: '#00C2A8', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, flex: 1, justifyContent: 'center' },
  cityWrap: { flexDirection: 'row', flexWrap: 'wrap', padding: 10 },
  cityBtn: { backgroundColor: '#F1F5F9', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, marginRight: 6, marginBottom: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  cityActive: { backgroundColor: '#FFD700', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, marginRight: 6, marginBottom: 6 },
  routeBox: { backgroundColor: '#FFFBEB', margin: 10, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#FFD700' },
  routeTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 8 },
  routeRow: { flexDirection: 'row' },
  routeBtn: { flex: 1, backgroundColor: 'white', padding: 12, borderRadius: 12, marginRight: 6, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  routeActive: { flex: 1, backgroundColor: '#FFD700', padding: 12, borderRadius: 12, marginRight: 6, borderWidth: 1, borderColor: '#FFD700', alignItems: 'center' },
  routeEmoji: { fontSize: 24 },
  routeInfo: { marginTop: 8, fontWeight: 'bold', color: '#00A651' },
  driverTitle: { fontSize: 18, fontWeight: 'bold', margin: 12 },
  joinBtn: { backgroundColor: '#0A0A0A', padding: 14, borderRadius: 12, marginHorizontal: 10 },
  form: { backgroundColor: '#FFFBEB', padding: 12, margin: 10, borderRadius: 12, borderWidth: 1, borderColor: '#FFD700' },
  submitBtn: { backgroundColor: '#00C2A8', padding: 12, borderRadius: 12, marginTop: 4 },
  driverSearchBox: { flexDirection: 'row', marginHorizontal: 10, marginTop: 10, alignItems: 'center' },
  driverSearchInput: { flex: 1, backgroundColor: '#FFF7ED', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#FFD700' },
  clearBtn: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, marginLeft: 6 },
  resultText: { marginHorizontal: 12, marginTop: 6, fontSize: 12, color: '#666', fontWeight: 'bold' },
  driverCard: { backgroundColor: 'white', marginHorizontal: 10, marginBottom: 10, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', elevation: 2 },
  driverTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#FFD700', fontSize: 22, fontWeight: 'bold' },
  driverName: { fontWeight: 'bold', fontSize: 16 },
  driverCity: { color: '#666', fontSize: 12 },
  driverCar: { fontSize: 12, marginTop: 2 },
  verified: { color: '#00A651', fontWeight: 'bold', marginTop: 8, fontSize: 12 },
  pending: { color: '#E67E00', fontWeight: 'bold', marginTop: 8, fontSize: 12 },
  callBtn: { backgroundColor: '#00C2A8', padding: 10, borderRadius: 10, marginTop: 8 }
});