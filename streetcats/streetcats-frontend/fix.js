const fs = require('fs');

const filesToFix = [
  'c:/Users/Paolo/Desktop/Universita/Terzo Anno/TecWeb/Progetto/TecWebProgetto/streetcats/streetcats-frontend/src/app/ui/profile/profile.component.html',
  'c:/Users/Paolo/Desktop/Universita/Terzo Anno/TecWeb/Progetto/TecWebProgetto/streetcats/streetcats-frontend/src/app/ui/cat-list/cat-list.component.html',
  'c:/Users/Paolo/Desktop/Universita/Terzo Anno/TecWeb/Progetto/TecWebProgetto/streetcats/streetcats-frontend/src/app/ui/cat-form/cat-form.component.html',
  'c:/Users/Paolo/Desktop/Universita/Terzo Anno/TecWeb/Progetto/TecWebProgetto/streetcats/streetcats-frontend/src/app/ui/cat-detail/cat-detail.component.html',
  'c:/Users/Paolo/Desktop/Universita/Terzo Anno/TecWeb/Progetto/TecWebProgetto/streetcats/streetcats-frontend/src/app/ui/navbar/navbar.component.html'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Ripristina i bordi
    content = content.split('1px solid var(--bg-main)').join('1px solid var(--bg-alt)');
    
    // Ripristina i separatori nella navbar
    content = content.split('<span style=\"height: 20px; background: var(--bg-main)\"><\/span>').join('<span style=\"height: 20px; background: var(--bg-alt)\"><\/span>');
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log('Fixed ' + file);
    }
  }
});

const stylesFile = 'c:/Users/Paolo/Desktop/Universita/Terzo Anno/TecWeb/Progetto/TecWebProgetto/streetcats/streetcats-frontend/src/styles.scss';
if (fs.existsSync(stylesFile)) {
  let styles = fs.readFileSync(stylesFile, 'utf8');
  if (styles.includes('--bg-main: #162030;')) {
    styles = styles.replace('--bg-main: #162030;', '--bg-alt: #162030;');
    fs.writeFileSync(stylesFile, styles);
    console.log('Fixed styles.scss');
  } else if (!styles.includes('--bg-alt: #162030;')) {
    styles = styles.replace('--bg-main: #090d16;', '--bg-main: #090d16;\n  --bg-alt: #162030;');
    fs.writeFileSync(stylesFile, styles);
    console.log('Fixed styles.scss by adding bg-alt');
  }
}
