/**
 * @return outputFilePath
 */
export declare function pandocConvert(text: any, { fileDirectoryPath, projectDirectoryPath, sourceFilePath, filesCache, protocolsWhiteListRegExp, codeChunksData, graphsCache, imageDirectoryPath, pandocMarkdownFlavor, pandocPath, latexEngine, imageMagickPath, mermaidTheme, onWillTransformMarkdown, onDidTransformMarkdown, }: {
    fileDirectoryPath: any;
    projectDirectoryPath: any;
    sourceFilePath: any;
    filesCache: any;
    protocolsWhiteListRegExp: any;
    codeChunksData: any;
    graphsCache: any;
    imageDirectoryPath: any;
    pandocMarkdownFlavor: any;
    pandocPath: any;
    latexEngine: any;
    imageMagickPath: any;
    mermaidTheme: any;
    onWillTransformMarkdown?: any;
    onDidTransformMarkdown?: any;
}, config?: {}): Promise<string>;
