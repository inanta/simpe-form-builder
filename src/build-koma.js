import replace from "replace-in-file";
import fs from "fs";

const results = replace.sync({
  files: "./dist/**/*.html",
  from: [
    /<title><\/title>/g,
    /(..\/)*public/g,
    // /{{ /g,
    // / }}/g,
    /<!-- {{ /g,
    / }} -->/g
  ],
  to: [
    "<title><?php echo $Koma['Config']->Koma->Title ?> | <?php echo $Koma['Config']->Koma->Subtitle ?></title>",
    "<?php echo NS_ROOT_URL ?>/public",
    "<?php echo ",
    "; ?>"
  ]
});

for (let index = 0; index < results.length; index++) {
  const result = results[index];

  if (result.hasChanged) {
    const file = result.file;
    const renamed_file = result.file.replace(".html", ".php");

    fs.renameSync(file, renamed_file);

    console.log(file + " ==> " + renamed_file);
  }
}

// console.log(results);
