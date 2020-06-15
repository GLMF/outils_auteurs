-- This is a sample custom writer for pandoc.  It produces a content.xml output
-- ready to integrate in a flat OpenOffice document. It follows guidelines
-- defined by Diamond Editions for GNU Linux Magazine France.
--
-- Invoke with: pandoc -t glmf-writer.lua
--
-- Note:  you need not have lua installed on your system to use this custom
-- writer.  However, if you do have lua installed, you can use it to test
-- changes to the script.  'lua sample.lua' will produce informative error
-- messages if your code contains syntax errors.

-- local pipe = pandoc.pipe
-- local stringify = (require "pandoc.utils").stringify

-- The global variable PANDOC_DOCUMENT contains the full AST of
-- the document which is going to be written. It can be used to
-- configure the writer.

require "os"

-- PANDOC_DOCUMENT.meta.prefix est donné par le Makefile. C'est le nom du
-- document généré. Il sert pour forger le nom des images
local meta_prefix = "prefix"
if PANDOC_DOCUMENT.meta.prefix then
  meta_prefix = PANDOC_DOCUMENT.meta.prefix
end

local meta_images = false
if PANDOC_DOCUMENT.meta.images then
  meta_images = string.lower(PANDOC_DOCUMENT.meta.images) == "on"
  if meta_images then
    print("[WARNING] Images are included in the final ODT")
  end
end

local meta_class = "class"
if PANDOC_DOCUMENT.meta.class then
  meta_class = PANDOC_DOCUMENT.meta.class
end


--[[ rPrint(struct, [limit], [indent])   Recursively print arbitrary data. 
	Set limit (default 100) to stanch infinite loops.
	Indents tables as [KEY] VALUE, nested tables as [KEY] [KEY]...[KEY] VALUE
	Set indent ("") to prefix each line:    Mytable [KEY] [KEY]...[KEY] VALUE
--]]
-- Credits: https://gist.github.com/stuby/5445834#file-rprint-lua
function rPrint(s, l, i) -- recursive Print (structure, limit, indent)
	l = (l) or 100; i = i or "";	-- default item limit, indent string
	if (l<1) then print "ERROR: Item limit reached."; return l-1 end;
	local ts = type(s);
	if (ts ~= "table") then print (i,ts,s); return l-1 end
	print (i,ts);           -- print "table"
	for k,v in pairs(s) do  -- print "[KEY] VALUE"
		l = rPrint(v, l, i.."\t["..tostring(k).."]");
		if (l < 0) then break end
	end
	return l
end

-- Table to store footnotes, so they can be included at the end.
local notes = {}

-- Tableau qui stoque les numéros de titres (ici jusqu'à 4 niveaux)
local titres = {0, 0, 0, 0}

-- Liste des figures indexées par le caption (identifiant)
local figures = {}

-- Pré-définition de la référence et de la légende de la prochaine image
local next_image = { ['caption'] = nil, ['title'] = nil }

-- Flags pour contrôler l'ajout des références automatiques et les chapitres
-- qui suivent la conclusion le cas échéant. ("Pour aller plus loin")
local referencesAdded = false
local conclusionAdded = false

-- Retourne le prochain numéro de titre pour un niveau (de 1 à 4) donné
local function getTitreStr(n, s)
  local str = ""
  if n == 1 and s == "Conclusion" then
    conclusionAdded = true
  end
  if conclusionAdded then
    return ""
  end
  if n < 0 or n > 4 then
    return ""
  end
  titres[n] = titres[n] + 1
  for i = n + 1, 4 do
    titres[i] = 0
  end

  for i = 1, n - 1 do
    str = str .. titres[i] .. "."
  end

  if meta_class == "modele-article-linuxpratique-tutoriel" and n == 1 then
    return "Étape " .. str .. titres[n] .. " : "
  end

  return str .. titres[n] .. " "
end

-- Retourne la caption et le numéro de la figure courante (Cite & CaptionedImage)
function getCaptionNum(caption)
  -- caption est l'identifiant de la figure
  -- num est le numéro de la figure
  if caption == "next" then
    return caption, #figures + 1
  elseif caption == "last" then
    return caption, #figures
  end
  local num = 0
  if caption == "" then
    num = #figures + 1
    caption = "__" .. num .. "__"
  else
    for i, v in pairs(figures) do
      if v == caption then
        num = i
        break
      end
    end
    if num == 0 then
      num = #figures + 1
    end
  end
  figures[num] = caption
  -- print("*** Image", caption, num)
  return caption, num
end

local function escape(s)
  local xml_special = { ['&'] = '&amp;', ['<'] = '&lt;', ['>'] = '&gt;', ['"'] = '&quot;' }
  return s:gsub('[&<>"]', function(c)
    return xml_special[c]
  end)
end

-- Implements a simple cache system based a MD5 digest of the data
local function getCacheFilename(data, ext)
  local ftmp = os.tmpname()
  local md5 = io.popen("md5sum >" .. ftmp, "w")
  md5:write(data)
  md5:close()
  md5 = io.open(ftmp, "r")
  local hdata = md5:read(32)
  md5:close()
  os.remove(ftmp)
  local fname = "cache/" .. hdata .. ext 
  local f = io.open(fname, "r")
  local fexists = f ~= nil
  if fexists then
    io.close(f)
  end
  return fexists, fname
end

local function Plantuml(s, type)
  s = "@start" .. type .. "\n" .. s .. "\n@end" .. type .. "\n"

  local exists, cname = getCacheFilename(s, ".svg")
  if not exists then
    local uname = os.tmpname()
    local file = io.open(uname, "w")
    file:write(s)
    file:close()
    print "Running plantuml..."
    os.execute("plantuml -tsvg -p <" .. uname .. " >" .. cname)
    os.remove(uname)
  end

  return CaptionedImage(cname, "", "", attr)
end

local function addReferences()

  if referencesAdded then
    return ""
  end

  referencesAdded = true

  local buffer = {}

  local function add(s)
    table.insert(buffer, s)
  end

  if #notes > 0 then
    add('<text:p text:style-name="Heading_20_1">Références</text:p>')
    for i, note in pairs(notes) do
      local d = note:find(">")
      note = note:sub(1, d) .. Strong("[" .. i .. "]") .. " " .. note:sub(d + 1)
      add(note)
    end
  end

  return table.concat(buffer, "\n") .. "\n"
end

-- Blocksep is used to separate block elements.
function Blocksep()
  return "\n"
end

function Doc(body, metadata, variables)
  return body .. addReferences()
end

function Str(s)
  return escape(s)
end

function Space()
  return " "
end

function SoftBreak()
  return " "
end

function LineBreak()
  return "<text:line-break/>"
end

function Emph(s)
  return '<text:span text:style-name="italic">' .. s .. "</text:span>"
end

function Strong(s)
  return '<text:span text:style-name="gras">' .. s .. "</text:span>"
end

function Subscript(s)
  return '<text:span text:style-name="indice">' .. s .. "</text:span>"
end

function Superscript(s)
  return '<text:span text:style-name="exposant">' .. s .. "</text:span>"
end

function SmallCaps(s)
  -- SmallCaps not supported by GLMF
  return s
end

function Strikeout(s)
  -- Strikeout not supported by GLMF
  return s
end

function Link(s, src, tit, attr)
  return '<text:span text:style-name="url">' .. s .. "</text:span>"
end

function Image(s, src, tit, attr)
  return "*** Image NOT IMPLEMENTED ***\n"
end

function Code(s, attr)
  return '<text:span text:style-name="code_5f_par">' .. escape(s) .. "</text:span>"
end

function InlineMath(s)
  return Plantuml(s, "math")
end

function DisplayMath(s)
  return Plantuml(s, "latex")
end

function SingleQuoted(s)
  return "« " .. s .. " »"
end

function DoubleQuoted(s)
  return "« " .. s .. " »"
end

function Note(s)
  -- Il faut rechercher s, et si on trouve pas, on rajoute un élément dans la
  -- table notes.
  local num = -1
  for i, v in pairs(notes) do
    if v == s then
      num = i
      break
    end
  end

  if num < 0 then
    num = #notes + 1
    table.insert(notes, s)
  end

  return Strong("[" .. num .. "]")
end

function getKeySpan(keys)
  local str = ""
  for key in keys:gmatch("[^ |\t]+") do
    if key == '+' then
      str = str .. " + "
    else
      str = str .. " " .. Strong(escape('<') .. key .. escape('>'))
    end
  end
  return str
end

function Span(s, attr)
  if attr.class == "menu" then
    return '<text:span text:style-name="menu">' .. s .. "</text:span>"
  elseif attr.class == "k" or attr.class == "keys" then
    return getKeySpan(s)
  end
  return "*** Span NOT IMPLEMENTED ***\n"
end

function RawInline(format, str)
-- DEPRECATED: Dans GLMF les <xxx> sont des touches clavier.
-- return Strong(escape(str)). 
  return "*** RawInline NOT IMPLEMENTED ***\n"
end

function Cite(c, cs)
  -- caption est l'identifiant de la figure
  -- num est le numéro de la figure
  local num = 0
  next_image.caption, next_image.title = c:match("^%[@figure%s+([%w_-]+)%s+(.*)%]$")

  if next_image.caption == nil then
    -- It's not a define
    caption = c:match("^%[@([%w_-]+)")
    if caption == "" then
      return ""
    end
    caption, num = getCaptionNum(caption)
    return tostring(num)
  else
    -- It's just a define
    caption, num = getCaptionNum(next_image.caption)
    return ""
  end
end

function Plain(s)
  return s
end

function Para(s)
  -- avoid encapsulating para into para (needed for formulas)
  if s:match("^<text:p") then
    return s
  end
  return '<text:p text:style-name="Normal">' .. s .. "</text:p>"
end

-- lev is an integer, the header level.
function Header(lev, s, attr)
  local refs = ""
  if conclusionAdded and s ~= "Remerciements" then
    refs = addReferences()
  end
  return refs .. '<text:p text:style-name="Heading_20_' .. lev .. '">' .. getTitreStr(lev, s) .. s .. "</text:p>"
end

function BlockQuote(s)
  -- return "<blockquote>\n" .. s .. "\n</blockquote>"
  return "*** BlockQuote NOT IMPLEMENTED ***\n"
end

function HorizontalRule()
  -- return "<hr/>"
  return "*** HorizontalRule NOT IMPLEMENTED ***\n"
end

function LineBlock(ls)
  -- return '<div style="white-space: pre-line;">' .. table.concat(ls, '\n') ..
  --        '</div>'
  return "*** LineBlock NOT IMPLEMENTED ***\n"
end

function CodeStrong(s)
  return '<text:span text:style-name="code_5f_em">' .. s .. "</text:span>"
end

function CodeBlockLogo(s)
  local lines = {}
  for line in s:gmatch("([^\n]*)\n?") do
    table.insert(lines, '<text:p text:style-name="pragma">/// Logo : ' .. line .. ' ///</text:p>\n')
  end
  return table.concat(lines, "\n")
end

function CodeBlock(s, attr)
  local class = string.lower(attr.class)

  -- rPrint(attr)
  if attr.include then
    s = ""
    local start = attr.start or ""
    local stop = attr.stop or "^\n$"
    local started = false
    for line in io.lines(attr.include) do
      if line:find(start) then
        started = true
      end
      if started then
        s = s .. line .. "\n"
      end
      if started and line:find(stop) then
        break
      end
    end
  end

  -- Pragma Logos
  if class == "logo" or class == "logos" then
    return CodeBlockLogo(s)
  end

  -- Plantuml source
  if class:find("plantuml") then
      return Plantuml(s, "uml")
  end

  -- Source code or console text
  local lines = {}
  local style = "code"

  if class == "" or class:find("text") or class:find("console") then
    style = "console"
  end

  local numberLines = class:find("numberlines") ~= nil
  local lineNumber = tonumber(attr.startFrom or 1)
  local numberFormat =  attr.format or "%2d: "
  local step = tonumber(attr.step or 1)

  -- get code_em* attributes if any
  local code_em_re = {}
  for k, v in pairs(attr) do
    if k:find("^code_em.*$") then
      v = escape(v)
      table.insert(code_em_re, v)
    end
  end

  local start_code_em = "<<<"
  local end_code_em = ">>>"

  -- for each line in code
  for line in s:gmatch("([^\n]*)\n?") do
    -- handle line number if any
    if numberLines then
      line = numberFormat:format(lineNumber) .. line
      lineNumber = lineNumber + step
    end
    -- escape special chars
    line = escape(line)
    -- handle code_em
    for _, re in pairs(code_em_re) do
      local d, f, em = line:find(re)
      if em or d then
        em = em or line:sub(d, f)
        line = line:gsub(em, start_code_em .. em .. end_code_em)
      end
    end
    -- move spaces to hard spaces
    line = line:gsub("( +)", function(s)
      return '<text:s text:c="' .. string.len(s) .. '"/>'
    end)
    -- Emphase marked code
    line = line:gsub(start_code_em, '<text:span text:style-name="code_5f_em">')
    line = line:gsub(end_code_em, '</text:span>')
    -- handle code style (code/console)
    line = '<text:p text:style-name="' .. style .. '">' .. line .. "</text:p>"
    table.insert(lines, line)
    -- TODO: handle highlighting
  end
  return table.concat(lines, "\n")
end

function BulletList(items)
  local buffer = {}
  for _, item in pairs(items) do
    table.insert(buffer, '<text:p text:style-name="Normal">- ' .. item .. " ;</text:p>")
  end
  return table.concat(buffer, "\n") .. "\n"
end

function OrderedList(items)
  local buffer = {}
  for i, item in pairs(items) do
    table.insert(buffer, '<text:p text:style-name="Normal">' .. i .. ". " .. item .. " ;</text:p>")
  end
  return table.concat(buffer, "\n") .. "\n"
end

function DefinitionList(items)
  -- local buffer = {}
  -- for _,item in pairs(items) do
  --   local k, v = next(item)
  --   table.insert(buffer, "<dt>" .. k .. "</dt>\n<dd>" ..
  --                  table.concat(v, "</dd>\n<dd>") .. "</dd>")
  -- end
  -- return "<dl>\n" .. table.concat(buffer, "\n") .. "\n</dl>"
  return "*** DefinitionList NOT IMPLEMENTED ***\n"
end

-- /// Image : nom_article_figure_01.png ///
function CaptionedImage(src, title, caption, attr)
  local num = 0

  if caption == "" and next_image.caption ~= nil then
    caption = next_image.caption
    if next_image.title ~= nil then
      title = next_image.title
    end
  end
  next_image.caption = nil
  next_image.title = nil

  caption, num = getCaptionNum(caption)

  local buffer = {}
  local function add(s)
    table.insert(buffer, s)
  end

  local ext = string.sub(src, string.find(src, "%.%a+$"))
  local dst = string.format("%s_figure_%02d%s", meta_prefix, num, ext)
  if src:find("//") then
    local exists, cfile = getCacheFilename(src, ext)
    if not exists then
      print("Downloading '" .. src .. "'")
      os.execute("curl " .. src .. " -s -o " .. cfile)
    end
    src = cfile
  end
  print("Copying '" .. src .. "' to 'build/" .. dst .. "'")
  os.execute("cp " .. src .. " build/" .. dst)
  if title:match("^fig:") then
    title = string.sub(title, 5)
  end
  if title ~= "" then
    title = " : " .. title
  end
  add('<text:p text:style-name="pragma">/// Image : ' .. dst .. " ///</text:p>")
  if meta_images then
    add('<text:p text:style-name="Normal"><draw:frame')
    local imgmgk = io.open("/usr/bin/identify", "r")
    if imgmgk then
      imgmgk:close()
      local identify = io.popen('/usr/bin/identify -format "%w %h" build/' .. dst, "r")
      local w, h = identify:read("*number", "*number")
      identify:close()
      -- Points par cm
      local ppcm = 32
      -- max 16 cm en largeur
      local w_cm = math.min(16, w / ppcm)
      -- max 8 cm en hauteur
      local h_cm = math.min(8, h / ppcm)
      -- aspect ratio
      if w > h then
        h_cm = w_cm * h / w
      else
        w_cm = h_cm * w / h
      end
      add(' svg:width="' .. w_cm .. 'cm" svg:height="' .. h_cm .. 'cm"')
    end
    add('><draw:image xlink:href="../' .. dst .. '"/>')
    add('</draw:frame>' .. '</text:p>')
  end
  add('<text:p text:style-name="legende">Fig. ' .. num .. title .. "</text:p>")

  return table.concat(buffer, "\n")
end

-- Caption is a string, aligns is an array of strings,
-- widths is an array of floats, headers is an array of
-- strings, rows is an array of arrays of strings.
function Table(caption, aligns, widths, headers, rows)
  local buffer = {}

  local function add(s)
    table.insert(buffer, s)
  end

  local function add_cell(s)
    add('<table:table-cell table:style-name="cell_simple" office:value-type="string">' ..
    '<text:p text:style-name="Normal">' .. s .. '</text:p>' ..
    '</table:table-cell>')
  end

  local function add_row(r)
    add('<table:table-row>')
    for i,c in pairs(r) do
      add_cell(c)
    end
    add('</table:table-row>')
  end

  add('<table:table>')
  add('<table:table-column table:number-columns-repeated="' .. #headers .. '"/>')
  add_row(headers)
  for _, row in pairs(rows) do
    add_row(row)
  end
  add('</table:table>')
  return table.concat(buffer,'\n')
end

function RawBlock(format, str)
  return str
end

function Div(s, attr)
  local class = string.lower(attr.class)
  local debut_note = ""
  local fin_note = "note"

  if class == "nda" or class == "ndlr" then
    s = s:gsub('^<.->', '<text:p text:style-name="note">')
    return s
  elseif class == "note" then
    debut_note = "note"
  elseif class == "attention" then
    debut_note = "note : Attention"
  elseif class == "avertissement" then
    debut_note = "note : Avertissement"
  elseif class == "pao" then
    debut_note = "note PAO"
    fin_note = debut_note
  elseif class == "encadre" or class == "encadré" then
    debut_note = "encadré"
    fin_note = debut_note
    s = s:gsub('^<.->', '<text:p text:style-name="Heading_20_1">')
  else
    debut_note = ""
    fin_note = debut_note
  end
  if debut_note ~= "" then
    return '<text:p text:style-name="pragma">/// Début ' .. debut_note .. ' ///</text:p>\n' ..
      s .. 
      '\n<text:p text:style-name="pragma">/// Fin ' .. fin_note .. ' ///</text:p>\n'
  else
    return "*** Div NOT IMPLEMENTED ***\n"
  end
end

