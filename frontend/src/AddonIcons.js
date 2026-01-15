import React from 'react';
import './AddonIcons.css';

const AddonIcons = () => {
  const getIconForAddon = (type, name = '') => {
    const icons = {
      // РџРѕСЃС‹РїРєРё
      'РЎР»Р°РґРєРёР№ С‡РёР»Рё': 'рџЊ¶пёЏ',
      'Р§РµСЂРЅР°СЏ СЃРѕР»СЊ': 'вљ«',
      'Р“РѕР»СѓР±Р°СЏ РјР°С‚С‡Р°': 'рџЊЂ',
      'РњРѕРєРєРѕ': 'в