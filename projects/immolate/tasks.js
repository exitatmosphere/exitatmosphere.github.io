function processNextPack(inst, ante) {
  const pack = inst.nextPack(ante);
  const packInfo = Immolate.packInfo(pack);
  const packType = packInfo.type;
  const packSize = packInfo.size;
  if (packSize > 3) {
    packInfo.delete();
    return null;
  }

  if (packType == "Arcana Pack" || packType == "Spectral Pack") {
    const cards =
      packType == "Arcana Pack"
        ? inst.nextArcanaPack(packSize, ante)
        : inst.nextSpectralPack(packSize, ante);

    for (let c = 0; c < packSize; c++) {
      const cardName = cards.get(c);

      if (cardName === "The Soul") {
        const joker = inst.nextJoker("sou", ante, false);
        const jokerName = joker.joker;

        if (jokerName === "Perkeo" || jokerName === "Triboulet") {
          inst.lock(jokerName);

          joker.delete();
          cards.delete();
          packInfo.delete();

          return packType;
        }

        joker.delete();
      }
    }

    cards.delete();
  }

  packInfo.delete();

  return null;
}

function processNextVoucher(inst, anteStart, anteEnd) {
  inst.lock("Overstock Plus");
  inst.lock("Liquidation");
  inst.lock("Glow Up");
  inst.lock("Reroll Glut");
  inst.lock("Omen Globe");
  inst.lock("Observatory");
  inst.lock("Nacho Tong");
  inst.lock("Recyclomancy");
  inst.lock("Tarot Tycoon");
  inst.lock("Planet Tycoon");
  inst.lock("Money Tree");
  inst.lock("Antimatter");
  inst.lock("Illusion");
  inst.lock("Petroglyph");
  inst.lock("Retcon");
  inst.lock("Palette");

  const searchedFor = ["Telescope", "Observatory"];
  const skipped = ["Tarot Tycoon", "Planet Merchant", "Magic Trick"];
  let found = [];

  for (let currAnte = anteStart; currAnte < anteEnd; currAnte++) {
    const voucher = inst.nextVoucher(currAnte);
    if (skipped.includes(voucher)) {
      continue;
    }
    inst.lock(voucher);
    const IMMOLATE_VOUCHERS = Immolate.VOUCHERS_GET();
    for (let i = 0; i < IMMOLATE_VOUCHERS.size(); i += 2) {
      if (IMMOLATE_VOUCHERS.get(i) === voucher) {
        inst.unlock(IMMOLATE_VOUCHERS.get(i + 1));
      }
    }
    if (searchedFor.includes(voucher)) {
      found.push(currAnte);
    }
    if (found.length >= searchedFor.length) {
      return found;
    }
  }

  return null;
}

function perkTribObs() {
  const timeStart = Math.floor(Date.now() / 1000);

  const alphabet = "ABCDEFGHIGKLMNOPQRSTUVWXYZ123456789";
  const randomAplhabetLetter = () =>
    alphabet[Math.floor(Math.random() * alphabet.length)];
  const seedLen = 8;

  const ante = 1;

  let tries = 0;
  while (true) {
    tries++;

    let seed = "";
    for (let i = 0; i < seedLen; i++) {
      seed += randomAplhabetLetter();
    }

    const inst = new Immolate.Instance(seed);
    inst.nextPack(ante);

    const found1 = processNextPack(inst, ante);
    if (found1 !== null) {
      const found2 = processNextPack(inst, ante);
      if (found2 !== null) {
        const foundVoucher = processNextVoucher(inst, ante + 1, ante + 11);
        if (foundVoucher !== null) {
          const timeEnd = Math.floor(Date.now() / 1000);
          const timeSpent = timeEnd - timeStart;

          console.log(`Found in ${tries} tries [${timeSpent} seconds]`);

          inst.delete();
          return [seed, found1, found2].concat(foundVoucher);
        }
      }
    }

    inst.delete();
  }
}
