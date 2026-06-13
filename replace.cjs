const fs = require('fs');
const path = require('path');

const srcDir = './src';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);
files.push('./index.html');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/SUFA\s*ERP/gi, 'MarketPulse')
    .replace(/SUFAERP/gi, 'MarketPulse')
    .replace(/Sufa\s*Books/gi, 'MarketPulse')
    .replace(/My Google AI Studio App/g, 'MarketPulse');

  // Replace Zap icons with the logo
  newContent = newContent.replace(/<Zap[^>]*>/g, '<img src="/auth-bg.jpg" alt="MarketPulse Logo" className="w-8 h-8 object-contain" />');
  
  // Cleanup any specific wrappers around Zap
  newContent = newContent.replace(/<div className="bg-slate-900 text-white p-1 rounded-md">\s*<img src="\/auth-bg\.jpg"[^>]*>\s*<\/div>/g, '<img src="/auth-bg.jpg" alt="MarketPulse Logo" className="w-8 h-8 object-contain" />');
  
  newContent = newContent.replace(/<div className="bg-blue-600 text-white p-1 rounded-sm">\s*<img src="\/auth-bg\.jpg"[^>]*>\s*<\/div>/g, '<img src="/auth-bg.jpg" alt="MarketPulse Logo" className="w-8 h-8 object-contain" />');
  
  newContent = newContent.replace(/<motion\.div\s+className="bg-blue-600 text-white p-1\.5 rounded-sm flex items-center justify-center shadow-xs"\s+whileHover=\{\{\s*rotate:\s*15\s*\}\}\s*>\s*<img src="\/auth-bg\.jpg"[^>]*>\s*<\/motion\.div>/g, '<motion.div whileHover={{ scale: 1.05 }}><img src="/auth-bg.jpg" alt="MarketPulse Logo" className="w-10 h-10 object-contain" /></motion.div>');

  // App.tsx specific branding replacements
  newContent = newContent.replace(/SUFA<span[^>]*>ERP<\/span>/g, 'MarketPulse');
  newContent = newContent.replace(/<div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center font-bold text-white">S<\/div>/g, '<img src="/auth-bg.jpg" alt="MarketPulse Logo" className="w-8 h-8 object-contain" />');

  // Remove the import Zap
  newContent = newContent.replace(/Zap, /g, '');
  newContent = newContent.replace(/, Zap/g, '');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated: ' + file);
  }
});
