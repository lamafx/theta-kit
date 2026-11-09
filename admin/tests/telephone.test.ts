import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { texteDuPdf } from '../lib/pdf.ts';
import { telephones, telephonesJson } from '../lib/telephone.ts';

test('repère les numéros ivoiriens, français et internationaux', () => {
  assert.deepEqual(telephones('Tél. : +225 0564122195'), ['+225 0564122195']);
  assert.equal(telephones('appelez le 07 08 09 10 11').length, 1);
  assert.equal(telephones('06.12.34.56.78').length, 1);
  assert.equal(telephones('(+33) 6 12 34 56 78').length, 1);
});

test('ignore années, plages et nombres à la française', () => {
  assert.deepEqual(telephones('Licence SRIT de 2023 à 2026, 2025-2026'), []);
  assert.deepEqual(telephones('1 919 exemples, 2 041 requêtes'), []);
  assert.deepEqual(telephones('Bronze Award 2026'), []);
});

test('cherche dans tout un JSON', () => {
  const r = telephonesJson({ contact: { email: 'a@b.c', tel: '+225 05 64 12 21 95' }, liste: ['ok'] });
  assert.equal(r.length, 1);
  assert.equal(r[0].chemin, 'contact.tel');
});

test('CV public sans téléphone, CV de travail avec', async () => {
  const pub = '../site/theta-kit/public/cv/CV-Ladji-Lama-Kamagate-ML.pdf';
  const prive = '../site/theta-kit/public/cv/CV-Ladji-Lama-Kamagate.pdf';
  const a = await texteDuPdf(fs.readFileSync(pub));
  assert.ok(a.pages.length > 500, 'texte lisible');
  assert.deepEqual(telephones(a.pages + '\n' + a.brut), []);
  if (fs.existsSync(prive)) {
    const b = await texteDuPdf(fs.readFileSync(prive));
    assert.ok(telephones(b.pages + '\n' + b.brut).length >= 1);
  }
});
