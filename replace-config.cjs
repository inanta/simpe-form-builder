module.exports = {
  files: "./dist/**/*.html",
  from: /\/public/g,
  to: "<?php echo NS_PUBLIC_PATH ?>"
};
