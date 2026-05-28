export const PETS = [
  {
    id: "pajamas-crayon-shin-chan",
    displayName: "Pajamas Crayon Shin-chan",
    description:
      "A chunky cartoon pajama mascot with bold black outlines, a white patchwork onesie, red pom cap, round face, pillow-hug sleeping pose, and clear small-size silhouette.",
    localizations: {
      zh: {
        displayName: "睡衣蜡笔小新",
        description:
          "一个圆滚滚的睡衣卡通桌宠，有粗黑描边、白色拼布连体睡衣、红色绒球睡帽、圆脸、抱枕睡姿，以及在小尺寸下也清晰的轮廓。",
        species: "卡通吉祥物",
        status: "同人制作",
        disclaimer:
          "这是一个非官方同人 Codex 桌宠包，仅供个人使用，与原角色权利方无关联，也未获得其背书。"
      }
    },
    species: "Cartoon mascot",
    status: "Fan-made",
    creator: "Astro-y",
    version: "v1.0.0",
    tags: ["pajamas", "cartoon", "sleepy", "codex-pet"],
    sprite: {
      path: "/pets/pajamas-crayon-shin-chan/spritesheet.webp",
      columns: 8,
      rows: 9,
      cellWidth: 192,
      cellHeight: 208,
      idleFrames: 6
    },
    manifestPath: "/pets/pajamas-crayon-shin-chan/pet.json",
    releaseZip:
      "https://github.com/Astro-y/petdev/releases/download/v1.0.0/pajamas-crayon-shin-chan.zip",
    installCommand: "npx petdev install pajamas-crayon-shin-chan",
    installOptions: {
      windows: [
        {
          label: "CLI",
          command: "npx petdev install pajamas-crayon-shin-chan"
        },
        {
          label: "PowerShell",
          command:
            "irm https://petdev.8xy.net/install/pajamas-crayon-shin-chan?platform=ps1 | iex"
        }
      ],
      macos: [
        {
          label: "CLI",
          command: "npx petdev install pajamas-crayon-shin-chan"
        },
        {
          label: "Shell",
          command:
            "curl -sSf https://petdev.8xy.net/install/pajamas-crayon-shin-chan | sh"
        }
      ],
      linux: [
        {
          label: "CLI",
          command: "npx petdev install pajamas-crayon-shin-chan"
        },
        {
          label: "Shell",
          command:
            "curl -sSf https://petdev.8xy.net/install/pajamas-crayon-shin-chan | sh"
        }
      ]
    },
    disclaimer:
      "This is an unofficial fan-made Codex pet package for personal use. It is not affiliated with or endorsed by the original character rights holders."
  }
];
