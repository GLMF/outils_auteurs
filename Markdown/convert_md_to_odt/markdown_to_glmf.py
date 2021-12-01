"""Convert from Markdown to OpenOffice for Linux Magazine.

Requirements:

* Python 3+ (doesn't seem to work on Python 2 because of odfpy)
* Latest IPython and Jupyter

Installation:

    pip install ipymd
    pip install odfpy
    git clone https://gist.github.com/99a2316465c84192b630.git md2glmf
    cd md2glmf

Usage:

    python markdow_to_glmf.py somedocument.md

This generates `somedocument.odt`.

Note: the conversion code lives in the ipymd repo at https://github.com/rossant/ipymd

"""

import os
import os.path as op
import re
import sys
import codecs

from ipymd import convert
from ipymd.core.prompt import SimplePromptManager, PythonPromptManager
from ipymd.lib.opendocument import ODFDocument, ODFRenderer, load_styles
from ipymd.formats.opendocument import ODFWriter, load_odf


SCRIPTDIR = op.dirname(op.realpath(__file__))


_PUNCTUATION_REGEX = r'[^\w\- ]'


def glmf_styles(path):
    styles = load_styles(path)
    return {name: style for name, style in styles.items()
            }


mapping = {'normal-paragraph': 'Normal',
           'heading-1': 'Heading',
           'heading-2': 'Heading 1',
           'heading-3': 'Heading 2',
           'heading-4': 'Heading 3',
           'heading-5': 'Heading 4',
           'code': 'code',
           'italic': 'italic',
           'bold': 'gras',
           'url': 'url',
           'inline-code': 'code_par',
           }


def _read_md(path):
    with codecs.open(path, 'r', encoding='utf-8') as f:
        return f.read()


class GLMFODFRenderer(ODFRenderer):
    def paragraph(self, text):
        lines = text.splitlines()
        head, tail = lines[:1], lines[1:]
        if head[0] == 'chapeau':
            style = 'chapeau'
        elif head[0] == 'signature':
            style = 'Signature'
        elif head[0] == 'pragma':
            style = 'pragma'
        elif head[0] == 'console':
            style = 'console'
        elif head[0] == 'legende':
            style = 'legende'
        else:
            style = None
            tail = lines
        text = '\n'.join(tail)
        with self._doc.paragraph(style):
            self.text(text)

    def list_start(self, ordered=False):
        if self._doc.is_in_paragraph():
            self._doc.end_paragraph()
        # if ordered:
        #     self._doc.start_numbered_list()
        # else:
        #     self._doc.start_list()

    def list_end(self):
        # self._doc.end_list()
        pass

    def list_item_start(self):
        # self._doc.start_list_item()
        self._doc.start_paragraph()
        self._doc.text('- ')

    def list_item_end(self):
        if self._doc.is_in_paragraph():
            self._doc.end_paragraph()
        # self._doc.end_list_item()


def gen_odt(filename):
    print("Converting {0}...".format(filename), end=' ')
    template_path = '_template.ott'

    # Create the ODF document.
    styles = glmf_styles(template_path)

    # from pprint import pprint
    # pprint(styles)

    odf_doc = ODFDocument(styles=styles,
                          style_mapping=mapping)

    # Create the ODF writer.
    prompt = PythonPromptManager()
    writer = ODFWriter(odf_doc=odf_doc, prompt=prompt,
                       odf_renderer=GLMFODFRenderer
                       )

    # Read Markdown file.
    md = _read_md(filename)

    # Convert the Markdown file to the ODF file.
    convert(md, from_='markdown', to='opendocument', writer=writer)

    # Save the ODF chapter.
    writer.contents.save(op.join(op.splitext(filename)[0] + '.odt'))

    print("done.")


if __name__ == '__main__':
    import sys
    gen_odt(sys.argv[1])
