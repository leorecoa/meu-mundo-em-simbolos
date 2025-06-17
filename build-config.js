// Configuração para build de produção e geração de App Bundle
export default {
  appName: "Meu Mundo em Símbolos",
  packageName: "com.meumundoemsimbolos.app",
  versionName: "1.0.0",
  versionCode: 1,
  icon: "/lovable-uploads/e3f113b1-11eb-4777-bff3-164fac8b0f28.png",
  splashScreen: {
    image: "/lovable-uploads/e3f113b1-11eb-4777-bff3-164fac8b0f28.png",
    backgroundColor: "#3B82F6"
  },
  permissions: [
    "android.permission.INTERNET"
  ],
  playStore: {
    minSdkVersion: 21,
    targetSdkVersion: 33
  }
};