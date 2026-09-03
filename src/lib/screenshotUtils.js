import * as htmlToImage from 'html-to-image';

// Gera um PNG do elemento e tenta copiar para a área de transferência.
// Se o navegador bloquear o clipboard, faz o download do arquivo como alternativa.
// Retorna true se copiou para o clipboard, false se caiu no fallback de download.
export async function copyElementAsPng(element, { backgroundColor, filenamePrefix = 'Resumo' } = {}) {
  const blob = await htmlToImage.toBlob(element, {
    quality: 0.95,
    backgroundColor,
    pixelRatio: 2,
  });

  if (!blob) {
    throw new Error('Não foi possível gerar a imagem.');
  }

  if (navigator.clipboard && window.ClipboardItem) {
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      return true;
    } catch (err) {
      console.warn('Bloqueio de clipboard, iniciando download...', err);
    }
  }

  const link = document.createElement('a');
  link.download = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.png`;
  link.href = URL.createObjectURL(blob);
  link.click();
  return false;
}
