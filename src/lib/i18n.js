export const languages = [
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "zh", label: "中文", shortLabel: "中" }
];

const tagLabels = {
  en: {},
  zh: {
    pajamas: "睡衣",
    cartoon: "卡通",
    sleepy: "困困",
    "codex-pet": "Codex 桌宠"
  }
};

const dictionaries = {
  en: {
    common: {
      languageToggleLabel: "Language",
      pet: "pet",
      pets: "pets"
    },
    catalog: {
      eyebrow: "Codex Pet Catalog",
      title: "Petdev Island",
      lede:
        "A soft little island for Codex desktop pets, with install commands that work from npm and packages hosted on GitHub Releases.",
      availablePets: "Available pets"
    },
    detail: {
      back: "Back to catalog",
      installEyebrow: "Install",
      installTitle: "Use npx",
      installBody:
        "One command downloads the package from GitHub Releases and places it in your Codex pets folder.",
      petFile: "Pet File",
      petId: "Pet id",
      creator: "Creator",
      version: "Version",
      release: "Release",
      githubZip: "GitHub ZIP",
      copied: "Copied",
      copy: "Copy"
    }
  },
  zh: {
    common: {
      languageToggleLabel: "语言",
      pet: "只宠物",
      pets: "只宠物"
    },
    catalog: {
      eyebrow: "Codex 桌宠图鉴",
      title: "Petdev 岛屿",
      lede:
        "一个柔软可爱的 Codex 桌宠小岛，安装命令来自 npm，宠物包托管在 GitHub Releases。",
      availablePets: "可用桌宠"
    },
    detail: {
      back: "返回图鉴",
      installEyebrow: "安装",
      installTitle: "使用 npx",
      installBody:
        "一条命令会从 GitHub Releases 下载宠物包，并放入你的 Codex pets 目录。",
      petFile: "宠物文件",
      petId: "宠物 id",
      creator: "作者",
      version: "版本",
      release: "发布包",
      githubZip: "GitHub ZIP",
      copied: "已复制",
      copy: "复制"
    }
  }
};

export function normalizeLanguage(language) {
  return dictionaries[language] ? language : "en";
}

export function getDictionary(language) {
  return dictionaries[normalizeLanguage(language)];
}

export function getTagLabel(tag, language) {
  const normalized = normalizeLanguage(language);
  return tagLabels[normalized]?.[tag] || tag;
}

export function getLanguageFromLocales(locales = []) {
  const preferredLocale = locales.find(Boolean)?.toLowerCase() || "";
  return preferredLocale.startsWith("zh") ? "zh" : "en";
}

export function getPreferredLanguage(storedLanguage, locales = []) {
  return dictionaries[storedLanguage] ? storedLanguage : getLanguageFromLocales(locales);
}

export function getPetCopy(pet, language) {
  const normalized = normalizeLanguage(language);
  const localized = pet.localizations?.[normalized] || {};

  return {
    ...pet,
    displayName: localized.displayName || pet.displayName,
    description: localized.description || pet.description,
    species: localized.species || pet.species,
    status: localized.status || pet.status,
    disclaimer: localized.disclaimer || pet.disclaimer
  };
}
