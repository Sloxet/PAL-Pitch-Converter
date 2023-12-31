function loadSong(t) {
    song = new p5.SoundFile(t, function() {
        playBtn = createButton('<i class="fas fa-play"></i> Play');
        stopBtn = createButton('<i class="fas fa-stop"></i> Stop');
        PalPitchBtn = createButton('<i class="fa-solid fa-earth-europe"></i> PAL');
        downloadBtn = createButton('<i class="fas fa-download"></i> Download');

        playBtn.class('playBtn');
        stopBtn.class('stopBtn');
        PalPitchBtn.class('PalPitchBtn');
        downloadBtn.class('downloadBtn');

        playBtn.parent("buttons");
        stopBtn.parent("buttons");
        PalPitchBtn.parent("buttons");
        downloadBtn.parent("buttons");

        var isPalPitched = true;

        playBtn.mousePressed(function() {
            if (song.isPlaying()) {
                song.pause();
                playBtn.html('<i class="fas fa-play"></i> Play');
            } else {
                if (isPalPitched) {
                    song.rate(1.04);
                }
                song.play();
                playBtn.html('<i class="fas fa-pause"></i> Pause');
            }
        });

        stopBtn.mousePressed(function() {
            song.stop();
            playBtn.html('<i class="fas fa-play"></i> Play');
        });
    
        PalPitchBtn.mousePressed(function() {
            if (isPalPitched) {
                song.rate(1);
                PalPitchBtn.html('<i class="fa-solid fa-earth-americas"></i> NTSC');
                isPalPitched = false;
            } else {
                song.rate(1.04);
                PalPitchBtn.html('<i class="fa-solid fa-earth-europe"></i> PAL');
                isPalPitched = true;
            }
        });

        downloadBtn.mousePressed(function() {
            var fileNameWithoutExtension = file.elt.files[0].name.replace(/\.[^/.]+$/, '');
            var downloadFileName = fileNameWithoutExtension + ' (PAL Pitch).wav';

            var offlineContext = new OfflineAudioContext(2, song.buffer.length, song.buffer.sampleRate);

            var source = offlineContext.createBufferSource();
            source.buffer = song.buffer;

            var pitchShift = 1.14;
            source.playbackRate.value = pitchShift;

            source.connect(offlineContext.destination);

            source.start();

            offlineContext.startRendering().then(function(renderedBuffer) {
                var wavBlob = audioBufferToWav(renderedBuffer);
                
                var downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(wavBlob);
                downloadLink.download = downloadFileName;
                downloadLink.click();
            });
        });
    });
}

function audioBufferToWav(buffer) {
    var interleaved = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    var wavBuffer = writeWav(interleaved);
    return new Blob([wavBuffer], { type: 'audio/wav' });

    function interleave(leftChannel, rightChannel) {
        var totalLength = leftChannel.length + rightChannel.length;
        var result = new Float32Array(totalLength);
        var inputIndex = 0;

        for (var index = 0; index < totalLength;) {
            result[index++] = leftChannel[inputIndex];
            result[index++] = rightChannel[inputIndex];
            inputIndex++;
        }

        return result;
    }

    function writeWav(samples) {
        var buffer = new ArrayBuffer(44 + samples.length * 2);
        var view = new DataView(buffer);

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + samples.length * 2, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 2, true);
        view.setUint32(24, 44100, true);
        view.setUint32(28, 44100 * 4, true);
        view.setUint16(32, 4, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, samples.length * 2, true);

        floatTo16BitPCM(view, 44, samples);

        return buffer;
    }

    function writeString(view, offset, string) {
        for (var i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    function floatTo16BitPCM(output, offset, input) {
        for (var i = 0; i < input.length; i++, offset += 2) {
            var s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }
}

function setup() {
    noCanvas();
    file = createFileInput(function() {
        if (song !== undefined && song !== null) {
            song.stop();
            song = null;
        }
        removeElem(playBtn);
        removeElem(stopBtn);
        removeElem(PalPitchBtn);
        removeElem(downloadBtn);
        loadSong(file.elt.files[0]);
    });
    file.parent("file-input");
}

function removeElem(elem) {
    if (elem !== undefined && elem !== null) {
        elem.remove();
    }
}
var song, downloadBtn, playBtn, stopBtn, PalPitchBtn, file, fileDragged = !1;
!function(t) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = t();
    else if ("function" == typeof define && define.amd)
        define([], t);
    else {
        var e;
        e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this,
        e.p5 = t()
    }
}(function() {
    var define, module, exports;
    return function t(e, r, n) {
        function i(s, a) {
            if (!r[s]) {
                if (!e[s]) {
                    var h = "function" == typeof require && require;
                    if (!a && h)
                        return h(s, !0);
                    if (o)
                        return o(s, !0);
                    var u = new Error("Cannot find module '" + s + "'");
                    throw u.code = "MODULE_NOT_FOUND",
                    u
                }
                var l = r[s] = {
                    exports: {}
                };
                e[s][0].call(l.exports, function(t) {
                    var r = e[s][1][t];
                    return i(r ? r : t)
                }, l, l.exports, t, e, r, n)
            }
            return r[s].exports
        }
        for (var o = "function" == typeof require && require, s = 0; s < n.length; s++)
            i(n[s]);
        return i
    }({
        1: [function(t, e, r) {}
        , {}],
        2: [function(t, e, r) {
            "use strict";
            r.argument = function(t, e) {
                if (!t)
                    throw new Error(e)
            }
            ,
            r.assert = r.argument
        }
        , {}],
        3: [function(t, e, r) {
            "use strict";
            function n(t, e, r, n, i) {
                t.beginPath(),
                t.moveTo(e, r),
                t.lineTo(n, i),
                t.stroke()
            }
            r.line = n
        }
        , {}],
        4: [function(t, e, r) {
            "use strict";
            function n(t) {
                this.font = t
            }
            function i(t) {
                this.cmap = t
            }
            function o(t, e) {
                this.encoding = t,
                this.charset = e
            }
            function s(t) {
                var e;
                switch (t.version) {
                case 1:
                    this.names = r.standardNames.slice();
                    break;
                case 2:
                    for (this.names = new Array(t.numberOfGlyphs),
                    e = 0; e < t.numberOfGlyphs; e++)
                        t.glyphNameIndex[e] < r.standardNames.length ? this.names[e] = r.standardNames[t.glyphNameIndex[e]] : this.names[e] = t.names[t.glyphNameIndex[e] - r.standardNames.length];
                    break;
                case 2.5:
                    for (this.names = new Array(t.numberOfGlyphs),
                    e = 0; e < t.numberOfGlyphs; e++)
                        this.names[e] = r.standardNames[e + t.glyphNameIndex[e]];
                    break;
                case 3:
                    this.names = []
                }
            }
            function a(t) {
                for (var e, r = t.tables.cmap.glyphIndexMap, n = Object.keys(r), i = 0; i < n.length; i += 1) {
                    var o = n[i]
                      , s = r[o];
                    e = t.glyphs.get(s),
                    e.addUnicode(parseInt(o))
                }
                for (i = 0; i < t.glyphs.length; i += 1)
                    e = t.glyphs.get(i),
                    t.cffEncoding ? e.name = t.cffEncoding.charset[i] : e.name = t.glyphNames.glyphIndexToName(i)
            }
            var h = [".notdef", "space", "exclam", "quotedbl", "numbersign", "dollar", "percent", "ampersand", "quoteright", "parenleft", "parenright", "asterisk", "plus", "comma", "hyphen", "period", "slash", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "colon", "semicolon", "less", "equal", "greater", "question", "at", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "bracketleft", "backslash", "bracketright", "asciicircum", "underscore", "quoteleft", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "braceleft", "bar", "braceright", "asciitilde", "exclamdown", "cent", "sterling", "fraction", "yen", "florin", "section", "currency", "quotesingle", "quotedblleft", "guillemotleft", "guilsinglleft", "guilsinglright", "fi", "fl", "endash", "dagger", "daggerdbl", "periodcentered", "paragraph", "bullet", "quotesinglbase", "quotedblbase", "quotedblright", "guillemotright", "ellipsis", "perthousand", "questiondown", "grave", "acute", "circumflex", "tilde", "macron", "breve", "dotaccent", "dieresis", "ring", "cedilla", "hungarumlaut", "ogonek", "caron", "emdash", "AE", "ordfeminine", "Lslash", "Oslash", "OE", "ordmasculine", "ae", "dotlessi", "lslash", "oslash", "oe", "germandbls", "onesuperior", "logicalnot", "mu", "trademark", "Eth", "onehalf", "plusminus", "Thorn", "onequarter", "divide", "brokenbar", "degree", "thorn", "threequarters", "twosuperior", "registered", "minus", "eth", "multiply", "threesuperior", "copyright", "Aacute", "Acircumflex", "Adieresis", "Agrave", "Aring", "Atilde", "Ccedilla", "Eacute", "Ecircumflex", "Edieresis", "Egrave", "Iacute", "Icircumflex", "Idieresis", "Igrave", "Ntilde", "Oacute", "Ocircumflex", "Odieresis", "Ograve", "Otilde", "Scaron", "Uacute", "Ucircumflex", "Udieresis", "Ugrave", "Yacute", "Ydieresis", "Zcaron", "aacute", "acircumflex", "adieresis", "agrave", "aring", "atilde", "ccedilla", "eacute", "ecircumflex", "edieresis", "egrave", "iacute", "icircumflex", "idieresis", "igrave", "ntilde", "oacute", "ocircumflex", "odieresis", "ograve", "otilde", "scaron", "uacute", "ucircumflex", "udieresis", "ugrave", "yacute", "ydieresis", "zcaron", "exclamsmall", "Hungarumlautsmall", "dollaroldstyle", "dollarsuperior", "ampersandsmall", "Acutesmall", "parenleftsuperior", "parenrightsuperior", "266 ff", "onedotenleader", "zerooldstyle", "oneoldstyle", "twooldstyle", "threeoldstyle", "fouroldstyle", "fiveoldstyle", "sixoldstyle", "sevenoldstyle", "eightoldstyle", "nineoldstyle", "commasuperior", "threequartersemdash", "periodsuperior", "questionsmall", "asuperior", "bsuperior", "centsuperior", "dsuperior", "esuperior", "isuperior", "lsuperior", "msuperior", "nsuperior", "osuperior", "rsuperior", "ssuperior", "tsuperior", "ff", "ffi", "ffl", "parenleftinferior", "parenrightinferior", "Circumflexsmall", "hyphensuperior", "Gravesmall", "Asmall", "Bsmall", "Csmall", "Dsmall", "Esmall", "Fsmall", "Gsmall", "Hsmall", "Ismall", "Jsmall", "Ksmall", "Lsmall", "Msmall", "Nsmall", "Osmall", "Psmall", "Qsmall", "Rsmall", "Ssmall", "Tsmall", "Usmall", "Vsmall", "Wsmall", "Xsmall", "Ysmall", "Zsmall", "colonmonetary", "onefitted", "rupiah", "Tildesmall", "exclamdownsmall", "centoldstyle", "Lslashsmall", "Scaronsmall", "Zcaronsmall", "Dieresissmall", "Brevesmall", "Caronsmall", "Dotaccentsmall", "Macronsmall", "figuredash", "hypheninferior", "Ogoneksmall", "Ringsmall", "Cedillasmall", "questiondownsmall", "oneeighth", "threeeighths", "fiveeighths", "seveneighths", "onethird", "twothirds", "zerosuperior", "foursuperior", "fivesuperior", "sixsuperior", "sevensuperior", "eightsuperior", "ninesuperior", "zeroinferior", "oneinferior", "twoinferior", "threeinferior", "fourinferior", "fiveinferior", "sixinferior", "seveninferior", "eightinferior", "nineinferior", "centinferior", "dollarinferior", "periodinferior", "commainferior", "Agravesmall", "Aacutesmall", "Acircumflexsmall", "Atildesmall", "Adieresissmall", "Aringsmall", "AEsmall", "Ccedillasmall", "Egravesmall", "Eacutesmall", "Ecircumflexsmall", "Edieresissmall", "Igravesmall", "Iacutesmall", "Icircumflexsmall", "Idieresissmall", "Ethsmall", "Ntildesmall", "Ogravesmall", "Oacutesmall", "Ocircumflexsmall", "Otildesmall", "Odieresissmall", "OEsmall", "Oslashsmall", "Ugravesmall", "Uacutesmall", "Ucircumflexsmall", "Udieresissmall", "Yacutesmall", "Thornsmall", "Ydieresissmall", "001.000", "001.001", "001.002", "001.003", "Black", "Bold", "Book", "Light", "Medium", "Regular", "Roman", "Semibold"]
              , u = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "space", "exclam", "quotedbl", "numbersign", "dollar", "percent", "ampersand", "quoteright", "parenleft", "parenright", "asterisk", "plus", "comma", "hyphen", "period", "slash", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "colon", "semicolon", "less", "equal", "greater", "question", "at", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "bracketleft", "backslash", "bracketright", "asciicircum", "underscore", "quoteleft", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "braceleft", "bar", "braceright", "asciitilde", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "exclamdown", "cent", "sterling", "fraction", "yen", "florin", "section", "currency", "quotesingle", "quotedblleft", "guillemotleft", "guilsinglleft", "guilsinglright", "fi", "fl", "", "endash", "dagger", "daggerdbl", "periodcentered", "", "paragraph", "bullet", "quotesinglbase", "quotedblbase", "quotedblright", "guillemotright", "ellipsis", "perthousand", "", "questiondown", "", "grave", "acute", "circumflex", "tilde", "macron", "breve", "dotaccent", "dieresis", "", "ring", "cedilla", "", "hungarumlaut", "ogonek", "caron", "emdash", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "AE", "", "ordfeminine", "", "", "", "", "Lslash", "Oslash", "OE", "ordmasculine", "", "", "", "", "", "ae", "", "", "", "dotlessi", "", "", "lslash", "oslash", "oe", "germandbls"]
              , l = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "space", "exclamsmall", "Hungarumlautsmall", "", "dollaroldstyle", "dollarsuperior", "ampersandsmall", "Acutesmall", "parenleftsuperior", "parenrightsuperior", "twodotenleader", "onedotenleader", "comma", "hyphen", "period", "fraction", "zerooldstyle", "oneoldstyle", "twooldstyle", "threeoldstyle", "fouroldstyle", "fiveoldstyle", "sixoldstyle", "sevenoldstyle", "eightoldstyle", "nineoldstyle", "colon", "semicolon", "commasuperior", "threequartersemdash", "periodsuperior", "questionsmall", "", "asuperior", "bsuperior", "centsuperior", "dsuperior", "esuperior", "", "", "isuperior", "", "", "lsuperior", "msuperior", "nsuperior", "osuperior", "", "", "rsuperior", "ssuperior", "tsuperior", "", "ff", "fi", "fl", "ffi", "ffl", "parenleftinferior", "", "parenrightinferior", "Circumflexsmall", "hyphensuperior", "Gravesmall", "Asmall", "Bsmall", "Csmall", "Dsmall", "Esmall", "Fsmall", "Gsmall", "Hsmall", "Ismall", "Jsmall", "Ksmall", "Lsmall", "Msmall", "Nsmall", "Osmall", "Psmall", "Qsmall", "Rsmall", "Ssmall", "Tsmall", "Usmall", "Vsmall", "Wsmall", "Xsmall", "Ysmall", "Zsmall", "colonmonetary", "onefitted", "rupiah", "Tildesmall", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "exclamdownsmall", "centoldstyle", "Lslashsmall", "", "", "Scaronsmall", "Zcaronsmall", "Dieresissmall", "Brevesmall", "Caronsmall", "", "Dotaccentsmall", "", "", "Macronsmall", "", "", "figuredash", "hypheninferior", "", "", "Ogoneksmall", "Ringsmall", "Cedillasmall", "", "", "", "onequarter", "onehalf", "threequarters", "questiondownsmall", "oneeighth", "threeeighths", "fiveeighths", "seveneighths", "onethird", "twothirds", "", "", "zerosuperior", "onesuperior", "twosuperior", "threesuperior", "foursuperior", "fivesuperior", "sixsuperior", "sevensuperior", "eightsuperior", "ninesuperior", "zeroinferior", "oneinferior", "twoinferior", "threeinferior", "fourinferior", "fiveinferior", "sixinferior", "seveninferior", "eightinferior", "nineinferior", "centinferior", "dollarinferior", "periodinferior", "commainferior", "Agravesmall", "Aacutesmall", "Acircumflexsmall", "Atildesmall", "Adieresissmall", "Aringsmall", "AEsmall", "Ccedillasmall", "Egravesmall", "Eacutesmall", "Ecircumflexsmall", "Edieresissmall", "Igravesmall", "Iacutesmall", "Icircumflexsmall", "Idieresissmall", "Ethsmall", "Ntildesmall", "Ogravesmall", "Oacutesmall", "Ocircumflexsmall", "Otildesmall", "Odieresissmall", "OEsmall", "Oslashsmall", "Ugravesmall", "Uacutesmall", "Ucircumflexsmall", "Udieresissmall", "Yacutesmall", "Thornsmall", "Ydieresissmall"]
              , p = [".notdef", ".null", "nonmarkingreturn", "space", "exclam", "quotedbl", "numbersign", "dollar", "percent", "ampersand", "quotesingle", "parenleft", "parenright", "asterisk", "plus", "comma", "hyphen", "period", "slash", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "colon", "semicolon", "less", "equal", "greater", "question", "at", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "bracketleft", "backslash", "bracketright", "asciicircum", "underscore", "grave", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "braceleft", "bar", "braceright", "asciitilde", "Adieresis", "Aring", "Ccedilla", "Eacute", "Ntilde", "Odieresis", "Udieresis", "aacute", "agrave", "acircumflex", "adieresis", "atilde", "aring", "ccedilla", "eacute", "egrave", "ecircumflex", "edieresis", "iacute", "igrave", "icircumflex", "idieresis", "ntilde", "oacute", "ograve", "ocircumflex", "odieresis", "otilde", "uacute", "ugrave", "ucircumflex", "udieresis", "dagger", "degree", "cent", "sterling", "section", "bullet", "paragraph", "germandbls", "registered", "copyright", "trademark", "acute", "dieresis", "notequal", "AE", "Oslash", "infinity", "plusminus", "lessequal", "greaterequal", "yen", "mu", "partialdiff", "summation", "product", "pi", "integral", "ordfeminine", "ordmasculine", "Omega", "ae", "oslash", "questiondown", "exclamdown", "logicalnot", "radical", "florin", "approxequal", "Delta", "guillemotleft", "guillemotright", "ellipsis", "nonbreakingspace", "Agrave", "Atilde", "Otilde", "OE", "oe", "endash", "emdash", "quotedblleft", "quotedblright", "quoteleft", "quoteright", "divide", "lozenge", "ydieresis", "Ydieresis", "fraction", "currency", "guilsinglleft", "guilsinglright", "fi", "fl", "daggerdbl", "periodcentered", "quotesinglbase", "quotedblbase", "perthousand", "Acircumflex", "Ecircumflex", "Aacute", "Edieresis", "Egrave", "Iacute", "Icircumflex", "Idieresis", "Igrave", "Oacute", "Ocircumflex", "apple", "Ograve", "Uacute", "Ucircumflex", "Ugrave", "dotlessi", "circumflex", "tilde", "macron", "breve", "dotaccent", "ring", "cedilla", "hungarumlaut", "ogonek", "caron", "Lslash", "lslash", "Scaron", "scaron", "Zcaron", "zcaron", "brokenbar", "Eth", "eth", "Yacute", "yacute", "Thorn", "thorn", "minus", "multiply", "onesuperior", "twosuperior", "threesuperior", "onehalf", "onequarter", "threequarters", "franc", "Gbreve", "gbreve", "Idotaccent", "Scedilla", "scedilla", "Cacute", "cacute", "Ccaron", "ccaron", "dcroat"];
            n.prototype.charToGlyphIndex = function(t) {
                var e = t.charCodeAt(0)
                  , r = this.font.glyphs;
                if (!r)
                    return null;
                for (var n = 0; n < r.length; n += 1)
                    for (var i = r.get(n), o = 0; o < i.unicodes.length; o += 1)
                        if (i.unicodes[o] === e)
                            return n
            }
            ,
            i.prototype.charToGlyphIndex = function(t) {
                return this.cmap.glyphIndexMap[t.charCodeAt(0)] || 0
            }
            ,
            o.prototype.charToGlyphIndex = function(t) {
                var e = t.charCodeAt(0)
                  , r = this.encoding[e];
                return this.charset.indexOf(r)
            }
            ,
            s.prototype.nameToGlyphIndex = function(t) {
                return this.names.indexOf(t)
            }
            ,
            s.prototype.glyphIndexToName = function(t) {
                return this.names[t]
            }
            ,
            r.cffStandardStrings = h,
            r.cffStandardEncoding = u,
            r.cffExpertEncoding = l,
            r.standardNames = p,
            r.DefaultEncoding = n,
            r.CmapEncoding = i,
            r.CffEncoding = o,
            r.GlyphNames = s,
            r.addGlyphNames = a
        }
        , {}],
        5: [function(t, e, r) {
            "use strict";
            function n(t) {
                t = t || {},
                this.familyName = t.familyName || " ",
                this.styleName = t.styleName || " ",
                this.designer = t.designer || " ",
                this.designerURL = t.designerURL || " ",
                this.manufacturer = t.manufacturer || " ",
                this.manufacturerURL = t.manufacturerURL || " ",
                this.license = t.license || " ",
                this.licenseURL = t.licenseURL || " ",
                this.version = t.version || "Version 0.1",
                this.description = t.description || " ",
                this.copyright = t.copyright || " ",
                this.trademark = t.trademark || " ",
                this.unitsPerEm = t.unitsPerEm || 1e3,
                this.ascender = t.ascender,
                this.descender = t.descender,
                this.supported = !0,
                this.glyphs = new a.GlyphSet(this,t.glyphs || []),
                this.encoding = new s.DefaultEncoding(this),
                this.tables = {}
            }
            var i = t("./path")
              , o = t("./tables/sfnt")
              , s = t("./encoding")
              , a = t("./glyphset");
            n.prototype.hasChar = function(t) {
                return null !== this.encoding.charToGlyphIndex(t)
            }
            ,
            n.prototype.charToGlyphIndex = function(t) {
                return this.encoding.charToGlyphIndex(t)
            }
            ,
            n.prototype.charToGlyph = function(t) {
                var e = this.charToGlyphIndex(t)
                  , r = this.glyphs.get(e);
                return r || (r = this.glyphs.get(0)),
                r
            }
            ,
            n.prototype.stringToGlyphs = function(t) {
                for (var e = [], r = 0; r < t.length; r += 1) {
                    var n = t[r];
                    e.push(this.charToGlyph(n))
                }
                return e
            }
            ,
            n.prototype.nameToGlyphIndex = function(t) {
                return this.glyphNames.nameToGlyphIndex(t)
            }
            ,
            n.prototype.nameToGlyph = function(t) {
                var e = this.nametoGlyphIndex(t)
                  , r = this.glyphs.get(e);
                return r || (r = this.glyphs.get(0)),
                r
            }
            ,
            n.prototype.glyphIndexToName = function(t) {
                return this.glyphNames.glyphIndexToName ? this.glyphNames.glyphIndexToName(t) : ""
            }
            ,
            n.prototype.getKerningValue = function(t, e) {
                t = t.index || t,
                e = e.index || e;
                var r = this.getGposKerningValue;
                return r ? r(t, e) : this.kerningPairs[t + "," + e] || 0
            }
            ,
            n.prototype.forEachGlyph = function(t, e, r, n, i, o) {
                if (this.supported) {
                    e = void 0 !== e ? e : 0,
                    r = void 0 !== r ? r : 0,
                    n = void 0 !== n ? n : 72,
                    i = i || {};
                    for (var s = void 0 === i.kerning ? !0 : i.kerning, a = 1 / this.unitsPerEm * n, h = this.stringToGlyphs(t), u = 0; u < h.length; u += 1) {
                        var l = h[u];
                        if (o(l, e, r, n, i),
                        l.advanceWidth && (e += l.advanceWidth * a),
                        s && u < h.length - 1) {
                            var p = this.getKerningValue(l, h[u + 1]);
                            e += p * a
                        }
                    }
                }
            }
            ,
            n.prototype.getPath = function(t, e, r, n, o) {
                var s = new i.Path;
                return this.forEachGlyph(t, e, r, n, o, function(t, e, r, n) {
                    var i = t.getPath(e, r, n);
                    s.extend(i)
                }),
                s
            }
            ,
            n.prototype.draw = function(t, e, r, n, i, o) {
                this.getPath(e, r, n, i, o).draw(t)
            }
            ,
            n.prototype.drawPoints = function(t, e, r, n, i, o) {
                this.forEachGlyph(e, r, n, i, o, function(e, r, n, i) {
                    e.drawPoints(t, r, n, i)
                })
            }
            ,
            n.prototype.drawMetrics = function(t, e, r, n, i, o) {
                this.forEachGlyph(e, r, n, i, o, function(e, r, n, i) {
                    e.drawMetrics(t, r, n, i)
                })
            }
            ,
            n.prototype.validate = function() {
                function t(t, e) {
                    t || r.push(e)
                }
                function e(e) {
                    t(n[e] && n[e].trim().length > 0, "No " + e + " specified.")
                }
                var r = []
                  , n = this;
                e("familyName"),
                e("weightName"),
                e("manufacturer"),
                e("copyright"),
                e("version"),
                t(this.unitsPerEm > 0, "No unitsPerEm specified.")
            }
            ,
            n.prototype.toTables = function() {
                return o.fontToTable(this)
            }
            ,
            n.prototype.toBuffer = function() {
                for (var t = this.toTables(), e = t.encode(), r = new ArrayBuffer(e.length), n = new Uint8Array(r), i = 0; i < e.length; i++)
                    n[i] = e[i];
                return r
            }
            ,
            n.prototype.download = function() {
                var t = this.familyName.replace(/\s/g, "") + "-" + this.styleName + ".otf"
                  , e = this.toBuffer();
                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem,
                window.requestFileSystem(window.TEMPORARY, e.byteLength, function(r) {
                    r.root.getFile(t, {
                        create: !0
                    }, function(t) {
                        t.createWriter(function(r) {
                            var n = new DataView(e)
                              , i = new Blob([n],{
                                type: "font/opentype"
                            });
                            r.write(i),
                            r.addEventListener("writeend", function() {
                                location.href = t.toURL()
                            }, !1)
                        })
                    })
                }, function(t) {
                    throw t
                })
            }
            ,
            r.Font = n
        }
        , {
            "./encoding": 4,
            "./glyphset": 7,
            "./path": 10,
            "./tables/sfnt": 25
        }],
        6: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                var r = e || {
                    commands: []
                };
                return {
                    configurable: !0,
                    get: function() {
                        return "function" == typeof r && (r = r()),
                        r
                    },
                    set: function(t) {
                        r = t
                    }
                }
            }
            function i(t) {
                this.bindConstructorValues(t)
            }
            var o = t("./check")
              , s = t("./draw")
              , a = t("./path");
            i.prototype.bindConstructorValues = function(t) {
                this.index = t.index || 0,
                this.name = t.name || null,
                this.unicode = t.unicode || void 0,
                this.unicodes = t.unicodes || void 0 !== t.unicode ? [t.unicode] : [],
                t.xMin && (this.xMin = t.xMin),
                t.yMin && (this.yMin = t.yMin),
                t.xMax && (this.xMax = t.xMax),
                t.yMax && (this.yMax = t.yMax),
                t.advanceWidth && (this.advanceWidth = t.advanceWidth),
                Object.defineProperty(this, "path", n(this, t.path))
            }
            ,
            i.prototype.addUnicode = function(t) {
                0 === this.unicodes.length && (this.unicode = t),
                this.unicodes.push(t)
            }
            ,
            i.prototype.getPath = function(t, e, r) {
                t = void 0 !== t ? t : 0,
                e = void 0 !== e ? e : 0,
                r = void 0 !== r ? r : 72;
                for (var n = 1 / this.path.unitsPerEm * r, i = new a.Path, o = this.path.commands, s = 0; s < o.length; s += 1) {
                    var h = o[s];
                    "M" === h.type ? i.moveTo(t + h.x * n, e + -h.y * n) : "L" === h.type ? i.lineTo(t + h.x * n, e + -h.y * n) : "Q" === h.type ? i.quadraticCurveTo(t + h.x1 * n, e + -h.y1 * n, t + h.x * n, e + -h.y * n) : "C" === h.type ? i.curveTo(t + h.x1 * n, e + -h.y1 * n, t + h.x2 * n, e + -h.y2 * n, t + h.x * n, e + -h.y * n) : "Z" === h.type && i.closePath()
                }
                return i
            }
            ,
            i.prototype.getContours = function() {
                if (void 0 === this.points)
                    return [];
                for (var t = [], e = [], r = 0; r < this.points.length; r += 1) {
                    var n = this.points[r];
                    e.push(n),
                    n.lastPointOfContour && (t.push(e),
                    e = [])
                }
                return o.argument(0 === e.length, "There are still points left in the current contour."),
                t
            }
            ,
            i.prototype.getMetrics = function() {
                for (var t = this.path.commands, e = [], r = [], n = 0; n < t.length; n += 1) {
                    var i = t[n];
                    "Z" !== i.type && (e.push(i.x),
                    r.push(i.y)),
                    ("Q" === i.type || "C" === i.type) && (e.push(i.x1),
                    r.push(i.y1)),
                    "C" === i.type && (e.push(i.x2),
                    r.push(i.y2))
                }
                var o = {
                    xMin: Math.min.apply(null, e),
                    yMin: Math.min.apply(null, r),
                    xMax: Math.max.apply(null, e),
                    yMax: Math.max.apply(null, r),
                    leftSideBearing: 0
                };
                return o.rightSideBearing = this.advanceWidth - o.leftSideBearing - (o.xMax - o.xMin),
                o
            }
            ,
            i.prototype.draw = function(t, e, r, n) {
                this.getPath(e, r, n).draw(t)
            }
            ,
            i.prototype.drawPoints = function(t, e, r, n) {
                function i(e, r, n, i) {
                    var o = 2 * Math.PI;
                    t.beginPath();
                    for (var s = 0; s < e.length; s += 1)
                        t.moveTo(r + e[s].x * i, n + e[s].y * i),
                        t.arc(r + e[s].x * i, n + e[s].y * i, 2, 0, o, !1);
                    t.closePath(),
                    t.fill()
                }
                e = void 0 !== e ? e : 0,
                r = void 0 !== r ? r : 0,
                n = void 0 !== n ? n : 24;
                for (var o = 1 / this.path.unitsPerEm * n, s = [], a = [], h = this.path, u = 0; u < h.commands.length; u += 1) {
                    var l = h.commands[u];
                    void 0 !== l.x && s.push({
                        x: l.x,
                        y: -l.y
                    }),
                    void 0 !== l.x1 && a.push({
                        x: l.x1,
                        y: -l.y1
                    }),
                    void 0 !== l.x2 && a.push({
                        x: l.x2,
                        y: -l.y2
                    })
                }
                t.fillStyle = "blue",
                i(s, e, r, o),
                t.fillStyle = "red",
                i(a, e, r, o)
            }
            ,
            i.prototype.drawMetrics = function(t, e, r, n) {
                var i;
                e = void 0 !== e ? e : 0,
                r = void 0 !== r ? r : 0,
                n = void 0 !== n ? n : 24,
                i = 1 / this.path.unitsPerEm * n,
                t.lineWidth = 1,
                t.strokeStyle = "black",
                s.line(t, e, -1e4, e, 1e4),
                s.line(t, -1e4, r, 1e4, r);
                var o = this.xMin || 0
                  , a = this.yMin || 0
                  , h = this.xMax || 0
                  , u = this.yMax || 0
                  , l = this.advanceWidth || 0;
                t.strokeStyle = "blue",
                s.line(t, e + o * i, -1e4, e + o * i, 1e4),
                s.line(t, e + h * i, -1e4, e + h * i, 1e4),
                s.line(t, -1e4, r + -a * i, 1e4, r + -a * i),
                s.line(t, -1e4, r + -u * i, 1e4, r + -u * i),
                t.strokeStyle = "green",
                s.line(t, e + l * i, -1e4, e + l * i, 1e4)
            }
            ,
            r.Glyph = i
        }
        , {
            "./check": 2,
            "./draw": 3,
            "./path": 10
        }],
        7: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                if (this.font = t,
                this.glyphs = {},
                Array.isArray(e))
                    for (var r = 0; r < e.length; r++)
                        this.glyphs[r] = e[r];
                this.length = e && e.length || 0
            }
            function i(t, e) {
                return new a.Glyph({
                    index: e,
                    font: t
                })
            }
            function o(t, e, r, n, i, o) {
                return function() {
                    var s = new a.Glyph({
                        index: e,
                        font: t
                    });
                    return s.path = function() {
                        r(s, n, i);
                        var e = o(t.glyphs, s);
                        return e.unitsPerEm = t.unitsPerEm,
                        e
                    }
                    ,
                    s
                }
            }
            function s(t, e, r, n) {
                return function() {
                    var i = new a.Glyph({
                        index: e,
                        font: t
                    });
                    return i.path = function() {
                        var e = r(t, i, n);
                        return e.unitsPerEm = t.unitsPerEm,
                        e
                    }
                    ,
                    i
                }
            }
            var a = t("./glyph");
            n.prototype.get = function(t) {
                return "function" == typeof this.glyphs[t] && (this.glyphs[t] = this.glyphs[t]()),
                this.glyphs[t]
            }
            ,
            n.prototype.push = function(t, e) {
                this.glyphs[t] = e,
                this.length++
            }
            ,
            r.GlyphSet = n,
            r.glyphLoader = i,
            r.ttfGlyphLoader = o,
            r.cffGlyphLoader = s
        }
        , {
            "./glyph": 6
        }],
        8: [function(t, e, r) {
            "use strict";
            function n(t) {
                for (var e = new ArrayBuffer(t.length), r = new Uint8Array(e), n = 0; n < t.length; n += 1)
                    r[n] = t[n];
                return e
            }
            function i(e, r) {
                var i = t("fs");
                i.readFile(e, function(t, e) {
                    return t ? r(t.message) : void r(null, n(e))
                })
            }
            function o(t, e) {
                var r = new XMLHttpRequest;
                r.open("get", t, !0),
                r.responseType = "arraybuffer",
                r.onload = function() {
                    return 200 !== r.status ? e("Font could not be loaded: " + r.statusText) : e(null, r.response)
                }
                ,
                r.send()
            }
            function s(t) {
                var e, r, n, i, o, s, a, l = new u.Font, c = new DataView(t,0), A = p.getFixed(c, 0);
                if (1 === A)
                    l.outlinesFormat = "truetype";
                else {
                    if (A = p.getTag(c, 0),
                    "OTTO" !== A)
                        throw new Error("Unsupported OpenType version " + A);
                    l.outlinesFormat = "cff"
                }
                for (var C = p.getUShort(c, 4), R = 12, E = 0; C > E; E += 1) {
                    var P = p.getTag(c, R)
                      , N = p.getULong(c, R + 8);
                    switch (P) {
                    case "cmap":
                        l.tables.cmap = d.parse(c, N),
                        l.encoding = new h.CmapEncoding(l.tables.cmap),
                        l.encoding || (l.supported = !1);
                        break;
                    case "head":
                        l.tables.head = g.parse(c, N),
                        l.unitsPerEm = l.tables.head.unitsPerEm,
                        e = l.tables.head.indexToLocFormat;
                        break;
                    case "hhea":
                        l.tables.hhea = v.parse(c, N),
                        l.ascender = l.tables.hhea.ascender,
                        l.descender = l.tables.hhea.descender,
                        l.numberOfHMetrics = l.tables.hhea.numberOfHMetrics;
                        break;
                    case "hmtx":
                        r = N;
                        break;
                    case "maxp":
                        l.tables.maxp = T.parse(c, N),
                        l.numGlyphs = l.tables.maxp.numGlyphs;
                        break;
                    case "name":
                        l.tables.name = w.parse(c, N),
                        l.familyName = l.tables.name.fontFamily,
                        l.styleName = l.tables.name.fontSubfamily;
                        break;
                    case "OS/2":
                        l.tables.os2 = S.parse(c, N);
                        break;
                    case "post":
                        l.tables.post = M.parse(c, N),
                        l.glyphNames = new h.GlyphNames(l.tables.post);
                        break;
                    case "glyf":
                        n = N;
                        break;
                    case "loca":
                        i = N;
                        break;
                    case "CFF ":
                        o = N;
                        break;
                    case "kern":
                        s = N;
                        break;
                    case "GPOS":
                        a = N
                    }
                    R += 16
                }
                if (n && i) {
                    var O = 0 === e
                      , k = b.parse(c, i, l.numGlyphs, O);
                    l.glyphs = m.parse(c, n, k, l),
                    _.parse(c, r, l.numberOfHMetrics, l.numGlyphs, l.glyphs),
                    h.addGlyphNames(l)
                } else
                    o ? (f.parse(c, o, l),
                    h.addGlyphNames(l)) : l.supported = !1;
                return l.supported && (s ? l.kerningPairs = x.parse(c, s) : l.kerningPairs = {},
                a && y.parse(c, a, l)),
                l
            }
            function a(t, e) {
                var r = "undefined" == typeof window
                  , n = r ? i : o;
                n(t, function(t, r) {
                    if (t)
                        return e(t);
                    var n = s(r);
                    return n.supported ? e(null, n) : e("Font is not supported (is this a Postscript font?)")
                })
            }
            var h = t("./encoding")
              , u = t("./font")
              , l = t("./glyph")
              , p = t("./parse")
              , c = t("./path")
              , d = t("./tables/cmap")
              , f = t("./tables/cff")
              , m = t("./tables/glyf")
              , y = t("./tables/gpos")
              , g = t("./tables/head")
              , v = t("./tables/hhea")
              , _ = t("./tables/hmtx")
              , x = t("./tables/kern")
              , b = t("./tables/loca")
              , T = t("./tables/maxp")
              , w = t("./tables/name")
              , S = t("./tables/os2")
              , M = t("./tables/post");
            r._parse = p,
            r.Font = u.Font,
            r.Glyph = l.Glyph,
            r.Path = c.Path,
            r.parse = s,
            r.load = a
        }
        , {
            "./encoding": 4,
            "./font": 5,
            "./glyph": 6,
            "./parse": 9,
            "./path": 10,
            "./tables/cff": 12,
            "./tables/cmap": 13,
            "./tables/glyf": 14,
            "./tables/gpos": 15,
            "./tables/head": 16,
            "./tables/hhea": 17,
            "./tables/hmtx": 18,
            "./tables/kern": 19,
            "./tables/loca": 20,
            "./tables/maxp": 21,
            "./tables/name": 22,
            "./tables/os2": 23,
            "./tables/post": 24,
            fs: 1
        }],
        9: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                this.data = t,
                this.offset = e,
                this.relativeOffset = 0
            }
            r.getByte = function(t, e) {
                return t.getUint8(e)
            }
            ,
            r.getCard8 = r.getByte,
            r.getUShort = function(t, e) {
                return t.getUint16(e, !1)
            }
            ,
            r.getCard16 = r.getUShort,
            r.getShort = function(t, e) {
                return t.getInt16(e, !1)
            }
            ,
            r.getULong = function(t, e) {
                return t.getUint32(e, !1)
            }
            ,
            r.getFixed = function(t, e) {
                var r = t.getInt16(e, !1)
                  , n = t.getUint16(e + 2, !1);
                return r + n / 65535
            }
            ,
            r.getTag = function(t, e) {
                for (var r = "", n = e; e + 4 > n; n += 1)
                    r += String.fromCharCode(t.getInt8(n));
                return r
            }
            ,
            r.getOffset = function(t, e, r) {
                for (var n = 0, i = 0; r > i; i += 1)
                    n <<= 8,
                    n += t.getUint8(e + i);
                return n
            }
            ,
            r.getBytes = function(t, e, r) {
                for (var n = [], i = e; r > i; i += 1)
                    n.push(t.getUint8(i));
                return n
            }
            ,
            r.bytesToString = function(t) {
                for (var e = "", r = 0; r < t.length; r += 1)
                    e += String.fromCharCode(t[r]);
                return e
            }
            ;
            var i = {
                "byte": 1,
                uShort: 2,
                "short": 2,
                uLong: 4,
                fixed: 4,
                longDateTime: 8,
                tag: 4
            };
            n.prototype.parseByte = function() {
                var t = this.data.getUint8(this.offset + this.relativeOffset);
                return this.relativeOffset += 1,
                t
            }
            ,
            n.prototype.parseChar = function() {
                var t = this.data.getInt8(this.offset + this.relativeOffset);
                return this.relativeOffset += 1,
                t
            }
            ,
            n.prototype.parseCard8 = n.prototype.parseByte,
            n.prototype.parseUShort = function() {
                var t = this.data.getUint16(this.offset + this.relativeOffset);
                return this.relativeOffset += 2,
                t
            }
            ,
            n.prototype.parseCard16 = n.prototype.parseUShort,
            n.prototype.parseSID = n.prototype.parseUShort,
            n.prototype.parseOffset16 = n.prototype.parseUShort,
            n.prototype.parseShort = function() {
                var t = this.data.getInt16(this.offset + this.relativeOffset);
                return this.relativeOffset += 2,
                t
            }
            ,
            n.prototype.parseF2Dot14 = function() {
                var t = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
                return this.relativeOffset += 2,
                t
            }
            ,
            n.prototype.parseULong = function() {
                var t = r.getULong(this.data, this.offset + this.relativeOffset);
                return this.relativeOffset += 4,
                t
            }
            ,
            n.prototype.parseFixed = function() {
                var t = r.getFixed(this.data, this.offset + this.relativeOffset);
                return this.relativeOffset += 4,
                t
            }
            ,
            n.prototype.parseOffset16List = n.prototype.parseUShortList = function(t) {
                for (var e = new Array(t), n = this.data, i = this.offset + this.relativeOffset, o = 0; t > o; o++)
                    e[o] = r.getUShort(n, i),
                    i += 2;
                return this.relativeOffset += 2 * t,
                e
            }
            ,
            n.prototype.parseString = function(t) {
                var e = this.data
                  , r = this.offset + this.relativeOffset
                  , n = "";
                this.relativeOffset += t;
                for (var i = 0; t > i; i++)
                    n += String.fromCharCode(e.getUint8(r + i));
                return n
            }
            ,
            n.prototype.parseTag = function() {
                return this.parseString(4)
            }
            ,
            n.prototype.parseLongDateTime = function() {
                var t = r.getULong(this.data, this.offset + this.relativeOffset + 4);
                return this.relativeOffset += 8,
                t
            }
            ,
            n.prototype.parseFixed = function() {
                var t = r.getULong(this.data, this.offset + this.relativeOffset);
                return this.relativeOffset += 4,
                t / 65536
            }
            ,
            n.prototype.parseVersion = function() {
                var t = r.getUShort(this.data, this.offset + this.relativeOffset)
                  , e = r.getUShort(this.data, this.offset + this.relativeOffset + 2);
                return this.relativeOffset += 4,
                t + e / 4096 / 10
            }
            ,
            n.prototype.skip = function(t, e) {
                void 0 === e && (e = 1),
                this.relativeOffset += i[t] * e
            }
            ,
            r.Parser = n
        }
        , {}],
        10: [function(t, e, r) {
            "use strict";
            function n() {
                this.commands = [],
                this.fill = "black",
                this.stroke = null,
                this.strokeWidth = 1
            }
            n.prototype.moveTo = function(t, e) {
                this.commands.push({
                    type: "M",
                    x: t,
                    y: e
                })
            }
            ,
            n.prototype.lineTo = function(t, e) {
                this.commands.push({
                    type: "L",
                    x: t,
                    y: e
                })
            }
            ,
            n.prototype.curveTo = n.prototype.bezierCurveTo = function(t, e, r, n, i, o) {
                this.commands.push({
                    type: "C",
                    x1: t,
                    y1: e,
                    x2: r,
                    y2: n,
                    x: i,
                    y: o
                })
            }
            ,
            n.prototype.quadTo = n.prototype.quadraticCurveTo = function(t, e, r, n) {
                this.commands.push({
                    type: "Q",
                    x1: t,
                    y1: e,
                    x: r,
                    y: n
                })
            }
            ,
            n.prototype.close = n.prototype.closePath = function() {
                this.commands.push({
                    type: "Z"
                })
            }
            ,
            n.prototype.extend = function(t) {
                t.commands && (t = t.commands),
                Array.prototype.push.apply(this.commands, t)
            }
            ,
            n.prototype.draw = function(t) {
                t.beginPath();
                for (var e = 0; e < this.commands.length; e += 1) {
                    var r = this.commands[e];
                    "M" === r.type ? t.moveTo(r.x, r.y) : "L" === r.type ? t.lineTo(r.x, r.y) : "C" === r.type ? t.bezierCurveTo(r.x1, r.y1, r.x2, r.y2, r.x, r.y) : "Q" === r.type ? t.quadraticCurveTo(r.x1, r.y1, r.x, r.y) : "Z" === r.type && t.closePath()
                }
                this.fill && (t.fillStyle = this.fill,
                t.fill()),
                this.stroke && (t.strokeStyle = this.stroke,
                t.lineWidth = this.strokeWidth,
                t.stroke())
            }
            ,
            n.prototype.toPathData = function(t) {
                function e(e) {
                    return Math.round(e) === e ? "" + Math.round(e) : e.toFixed(t)
                }
                function r() {
                    for (var t = "", r = 0; r < arguments.length; r += 1) {
                        var n = arguments[r];
                        n >= 0 && r > 0 && (t += " "),
                        t += e(n)
                    }
                    return t
                }
                t = void 0 !== t ? t : 2;
                for (var n = "", i = 0; i < this.commands.length; i += 1) {
                    var o = this.commands[i];
                    "M" === o.type ? n += "M" + r(o.x, o.y) : "L" === o.type ? n += "L" + r(o.x, o.y) : "C" === o.type ? n += "C" + r(o.x1, o.y1, o.x2, o.y2, o.x, o.y) : "Q" === o.type ? n += "Q" + r(o.x1, o.y1, o.x, o.y) : "Z" === o.type && (n += "Z")
                }
                return n
            }
            ,
            n.prototype.toSVG = function(t) {
                var e = '<path d="';
                return e += this.toPathData(t),
                e += '"',
                this.fill & "black" !== this.fill && (e += null === this.fill ? ' fill="none"' : ' fill="' + this.fill + '"'),
                this.stroke && (e += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"'),
                e += "/>"
            }
            ,
            r.Path = n
        }
        , {}],
        11: [function(t, e, r) {
            "use strict";
            function n(t, e, r) {
                var n;
                for (n = 0; n < e.length; n += 1) {
                    var i = e[n];
                    this[i.name] = i.value
                }
                if (this.tableName = t,
                this.fields = e,
                r) {
                    var o = Object.keys(r);
                    for (n = 0; n < o.length; n += 1) {
                        var s = o[n]
                          , a = r[s];
                        void 0 !== this[s] && (this[s] = a)
                    }
                }
            }
            var i = t("./check")
              , o = t("./types").encode
              , s = t("./types").sizeOf;
            n.prototype.sizeOf = function() {
                for (var t = 0, e = 0; e < this.fields.length; e += 1) {
                    var r = this.fields[e]
                      , n = this[r.name];
                    if (void 0 === n && (n = r.value),
                    "function" == typeof n.sizeOf)
                        t += n.sizeOf();
                    else {
                        var o = s[r.type];
                        i.assert("function" == typeof o, "Could not find sizeOf function for field" + r.name),
                        t += o(n)
                    }
                }
                return t
            }
            ,
            n.prototype.encode = function() {
                return o.TABLE(this)
            }
            ,
            r.Table = n
        }
        , {
            "./check": 2,
            "./types": 26
        }],
        12: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                if (t === e)
                    return !0;
                if (Array.isArray(t) && Array.isArray(e)) {
                    if (t.length !== e.length)
                        return !1;
                    for (var r = 0; r < t.length; r += 1)
                        if (!n(t[r], e[r]))
                            return !1;
                    return !0
                }
                return !1
            }
            function i(t, e, r) {
                var n, i, o, s = [], a = [], h = L.getCard16(t, e);
                if (0 !== h) {
                    var u = L.getByte(t, e + 2);
                    i = e + (h + 1) * u + 2;
                    var l = e + 3;
                    for (n = 0; h + 1 > n; n += 1)
                        s.push(L.getOffset(t, l, u)),
                        l += u;
                    o = i + s[h]
                } else
                    o = e + 2;
                for (n = 0; n < s.length - 1; n += 1) {
                    var p = L.getBytes(t, i + s[n], i + s[n + 1]);
                    r && (p = r(p)),
                    a.push(p)
                }
                return {
                    objects: a,
                    startOffset: e,
                    endOffset: o
                }
            }
            function o(t) {
                for (var e = "", r = 15, n = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "E", "E-", null, "-"]; ; ) {
                    var i = t.parseByte()
                      , o = i >> 4
                      , s = 15 & i;
                    if (o === r)
                        break;
                    if (e += n[o],
                    s === r)
                        break;
                    e += n[s]
                }
                return parseFloat(e)
            }
            function s(t, e) {
                var r, n, i, s;
                if (28 === e)
                    return r = t.parseByte(),
                    n = t.parseByte(),
                    r << 8 | n;
                if (29 === e)
                    return r = t.parseByte(),
                    n = t.parseByte(),
                    i = t.parseByte(),
                    s = t.parseByte(),
                    r << 24 | n << 16 | i << 8 | s;
                if (30 === e)
                    return o(t);
                if (e >= 32 && 246 >= e)
                    return e - 139;
                if (e >= 247 && 250 >= e)
                    return r = t.parseByte(),
                    256 * (e - 247) + r + 108;
                if (e >= 251 && 254 >= e)
                    return r = t.parseByte(),
                    256 * -(e - 251) - r - 108;
                throw new Error("Invalid b0 " + e)
            }
            function a(t) {
                for (var e = {}, r = 0; r < t.length; r += 1) {
                    var n, i = t[r][0], o = t[r][1];
                    if (n = 1 === o.length ? o[0] : o,
                    e.hasOwnProperty(i))
                        throw new Error("Object " + e + " already has key " + i);
                    e[i] = n
                }
                return e
            }
            function h(t, e, r) {
                e = void 0 !== e ? e : 0;
                var n = new L.Parser(t,e)
                  , i = []
                  , o = [];
                for (r = void 0 !== r ? r : t.length; n.relativeOffset < r; ) {
                    var h = n.parseByte();
                    21 >= h ? (12 === h && (h = 1200 + n.parseByte()),
                    i.push([h, o]),
                    o = []) : o.push(s(n, h))
                }
                return a(i)
            }
            function u(t, e) {
                return e = 390 >= e ? k.cffStandardStrings[e] : t[e - 391]
            }
            function l(t, e, r) {
                for (var n = {}, i = 0; i < e.length; i += 1) {
                    var o = e[i]
                      , s = t[o.op];
                    void 0 === s && (s = void 0 !== o.value ? o.value : null),
                    "SID" === o.type && (s = u(r, s)),
                    n[o.name] = s
                }
                return n
            }
            function p(t, e) {
                var r = {};
                return r.formatMajor = L.getCard8(t, e),
                r.formatMinor = L.getCard8(t, e + 1),
                r.size = L.getCard8(t, e + 2),
                r.offsetSize = L.getCard8(t, e + 3),
                r.startOffset = e,
                r.endOffset = e + 4,
                r
            }
            function c(t, e) {
                var r = h(t, 0, t.byteLength);
                return l(r, U, e)
            }
            function d(t, e, r, n) {
                var i = h(t, e, r);
                return l(i, B, n)
            }
            function f(t, e, r, n) {
                var i, o, s, a = new L.Parser(t,e);
                r -= 1;
                var h = [".notdef"]
                  , l = a.parseCard8();
                if (0 === l)
                    for (i = 0; r > i; i += 1)
                        o = a.parseSID(),
                        h.push(u(n, o));
                else if (1 === l)
                    for (; h.length <= r; )
                        for (o = a.parseSID(),
                        s = a.parseCard8(),
                        i = 0; s >= i; i += 1)
                            h.push(u(n, o)),
                            o += 1;
                else {
                    if (2 !== l)
                        throw new Error("Unknown charset format " + l);
                    for (; h.length <= r; )
                        for (o = a.parseSID(),
                        s = a.parseCard16(),
                        i = 0; s >= i; i += 1)
                            h.push(u(n, o)),
                            o += 1
                }
                return h
            }
            function m(t, e, r) {
                var n, i, o = {}, s = new L.Parser(t,e), a = s.parseCard8();
                if (0 === a) {
                    var h = s.parseCard8();
                    for (n = 0; h > n; n += 1)
                        i = s.parseCard8(),
                        o[i] = n
                } else {
                    if (1 !== a)
                        throw new Error("Unknown encoding format " + a);
                    var u = s.parseCard8();
                    for (i = 1,
                    n = 0; u > n; n += 1)
                        for (var l = s.parseCard8(), p = s.parseCard8(), c = l; l + p >= c; c += 1)
                            o[c] = i,
                            i += 1
                }
                return new k.CffEncoding(o,r)
            }
            function y(t, e, r) {
                function n(t, e) {
                    m && l.closePath(),
                    l.moveTo(t, e),
                    m = !0
                }
                function i() {
                    var e;
                    e = p.length % 2 !== 0,
                    e && !d && (f = p.shift() + t.nominalWidthX),
                    c += p.length >> 1,
                    p.length = 0,
                    d = !0
                }
                function o(r) {
                    for (var v, _, x, b, T, w, S, M, A, C, R, E, P = 0; P < r.length; ) {
                        var N = r[P];
                        switch (P += 1,
                        N) {
                        case 1:
                            i();
                            break;
                        case 3:
                            i();
                            break;
                        case 4:
                            p.length > 1 && !d && (f = p.shift() + t.nominalWidthX,
                            d = !0),
                            g += p.pop(),
                            n(y, g);
                            break;
                        case 5:
                            for (; p.length > 0; )
                                y += p.shift(),
                                g += p.shift(),
                                l.lineTo(y, g);
                            break;
                        case 6:
                            for (; p.length > 0 && (y += p.shift(),
                            l.lineTo(y, g),
                            0 !== p.length); )
                                g += p.shift(),
                                l.lineTo(y, g);
                            break;
                        case 7:
                            for (; p.length > 0 && (g += p.shift(),
                            l.lineTo(y, g),
                            0 !== p.length); )
                                y += p.shift(),
                                l.lineTo(y, g);
                            break;
                        case 8:
                            for (; p.length > 0; )
                                s = y + p.shift(),
                                a = g + p.shift(),
                                h = s + p.shift(),
                                u = a + p.shift(),
                                y = h + p.shift(),
                                g = u + p.shift(),
                                l.curveTo(s, a, h, u, y, g);
                            break;
                        case 10:
                            T = p.pop() + t.subrsBias,
                            w = t.subrs[T],
                            w && o(w);
                            break;
                        case 11:
                            return;
                        case 12:
                            switch (N = r[P],
                            P += 1,
                            N) {
                            case 35:
                                s = y + p.shift(),
                                a = g + p.shift(),
                                h = s + p.shift(),
                                u = a + p.shift(),
                                S = h + p.shift(),
                                M = u + p.shift(),
                                A = S + p.shift(),
                                C = M + p.shift(),
                                R = A + p.shift(),
                                E = C + p.shift(),
                                y = R + p.shift(),
                                g = E + p.shift(),
                                p.shift(),
                                l.curveTo(s, a, h, u, S, M),
                                l.curveTo(A, C, R, E, y, g);
                                break;
                            case 34:
                                s = y + p.shift(),
                                a = g,
                                h = s + p.shift(),
                                u = a + p.shift(),
                                S = h + p.shift(),
                                M = u,
                                A = S + p.shift(),
                                C = u,
                                R = A + p.shift(),
                                E = g,
                                y = R + p.shift(),
                                l.curveTo(s, a, h, u, S, M),
                                l.curveTo(A, C, R, E, y, g);
                                break;
                            case 36:
                                s = y + p.shift(),
                                a = g + p.shift(),
                                h = s + p.shift(),
                                u = a + p.shift(),
                                S = h + p.shift(),
                                M = u,
                                A = S + p.shift(),
                                C = u,
                                R = A + p.shift(),
                                E = C + p.shift(),
                                y = R + p.shift(),
                                l.curveTo(s, a, h, u, S, M),
                                l.curveTo(A, C, R, E, y, g);
                                break;
                            case 37:
                                s = y + p.shift(),
                                a = g + p.shift(),
                                h = s + p.shift(),
                                u = a + p.shift(),
                                S = h + p.shift(),
                                M = u + p.shift(),
                                A = S + p.shift(),
                                C = M + p.shift(),
                                R = A + p.shift(),
                                E = C + p.shift(),
                                Math.abs(R - y) > Math.abs(E - g) ? y = R + p.shift() : g = E + p.shift(),
                                l.curveTo(s, a, h, u, S, M),
                                l.curveTo(A, C, R, E, y, g);
                                break;
                            default:
                                console.log("Glyph " + e.index + ": unknown operator 1200" + N),
                                p.length = 0
                            }
                            break;
                        case 14:
                            p.length > 0 && !d && (f = p.shift() + t.nominalWidthX,
                            d = !0),
                            m && (l.closePath(),
                            m = !1);
                            break;
                        case 18:
                            i();
                            break;
                        case 19:
                        case 20:
                            i(),
                            P += c + 7 >> 3;
                            break;
                        case 21:
                            p.length > 2 && !d && (f = p.shift() + t.nominalWidthX,
                            d = !0),
                            g += p.pop(),
                            y += p.pop(),
                            n(y, g);
                            break;
                        case 22:
                            p.length > 1 && !d && (f = p.shift() + t.nominalWidthX,
                            d = !0),
                            y += p.pop(),
                            n(y, g);
                            break;
                        case 23:
                            i();
                            break;
                        case 24:
                            for (; p.length > 2; )
                                s = y + p.shift(),
                                a = g + p.shift(),
                                h = s + p.shift(),
                                u = a + p.shift(),
                                y = h + p.shift(),
                                g = u + p.shift(),
                                l.curveTo(s, a, h, u, y, g);
                            y += p.shift(),
                            g += p.shift(),
                            l.lineTo(y, g);
                            break;
                        case 25:
                            for (; p.length > 6; )
                                y += p.shift(),
                                g += p.shift(),
                                l.lineTo(y, g);
                            s = y + p.shift(),
                            a = g + p.shift(),
                            h = s + p.shift(),
                            u = a + p.shift(),
                            y = h + p.shift(),
                            g = u + p.shift(),
                            l.curveTo(s, a, h, u, y, g);
                            break;
                        case 26:
                            for (p.length % 2 && (y += p.shift()); p.length > 0; )
                                s = y,
                                a = g + p.shift(),
                                h = s + p.shift(),
                                u = a + p.shift(),
                                y = h,
                                g = u + p.shift(),
                                l.curveTo(s, a, h, u, y, g);
                            break;
                        case 27:
                            for (p.length % 2 && (g += p.shift()); p.length > 0; )
                                s = y + p.shift(),
                                a = g,
                                h = s + p.shift(),
                                u = a + p.shift(),
                                y = h + p.shift(),
                                g = u,
                                l.curveTo(s, a, h, u, y, g);
                            break;
                        case 28:
                            v = r[P],
                            _ = r[P + 1],
                            p.push((v << 24 | _ << 16) >> 16),
                            P += 2;
                            break;
                        case 29:
                            T = p.pop() + t.gsubrsBias,
                            w = t.gsubrs[T],
                            w && o(w);
                            break;
                        case 30:
                            for (; p.length > 0 && (s = y,
                            a = g + p.shift(),
                            h = s + p.shift(),
                            u = a + p.shift(),
                            y = h + p.shift(),
                            g = u + (1 === p.length ? p.shift() : 0),
                            l.curveTo(s, a, h, u, y, g),
                            0 !== p.length); )
                                s = y + p.shift(),
                                a = g,
                                h = s + p.shift(),
                                u = a + p.shift(),
                                g = u + p.shift(),
                                y = h + (1 === p.length ? p.shift() : 0),
                                l.curveTo(s, a, h, u, y, g);
                            break;
                        case 31:
                            for (; p.length > 0 && (s = y + p.shift(),
                            a = g,
                            h = s + p.shift(),
                            u = a + p.shift(),
                            g = u + p.shift(),
                            y = h + (1 === p.length ? p.shift() : 0),
                            l.curveTo(s, a, h, u, y, g),
                            0 !== p.length); )
                                s = y,
                                a = g + p.shift(),
                                h = s + p.shift(),
                                u = a + p.shift(),
                                y = h + p.shift(),
                                g = u + (1 === p.length ? p.shift() : 0),
                                l.curveTo(s, a, h, u, y, g);
                            break;
                        default:
                            32 > N ? console.log("Glyph " + e.index + ": unknown operator " + N) : 247 > N ? p.push(N - 139) : 251 > N ? (v = r[P],
                            P += 1,
                            p.push(256 * (N - 247) + v + 108)) : 255 > N ? (v = r[P],
                            P += 1,
                            p.push(256 * -(N - 251) - v - 108)) : (v = r[P],
                            _ = r[P + 1],
                            x = r[P + 2],
                            b = r[P + 3],
                            P += 4,
                            p.push((v << 24 | _ << 16 | x << 8 | b) / 65536))
                        }
                    }
                }
                var s, a, h, u, l = new D.Path, p = [], c = 0, d = !1, f = t.defaultWidthX, m = !1, y = 0, g = 0;
                return o(r),
                e.advanceWidth = f,
                l
            }
            function g(t) {
                var e;
                return e = t.length < 1240 ? 107 : t.length < 33900 ? 1131 : 32768
            }
            function v(t, e, r) {
                r.tables.cff = {};
                var n = p(t, e)
                  , o = i(t, n.endOffset, L.bytesToString)
                  , s = i(t, o.endOffset)
                  , a = i(t, s.endOffset, L.bytesToString)
                  , h = i(t, a.endOffset);
                r.gsubrs = h.objects,
                r.gsubrsBias = g(r.gsubrs);
                var u = new DataView(new Uint8Array(s.objects[0]).buffer)
                  , l = c(u, a.objects);
                r.tables.cff.topDict = l;
                var v = e + l["private"][1]
                  , _ = d(t, v, l["private"][0], a.objects);
                if (r.defaultWidthX = _.defaultWidthX,
                r.nominalWidthX = _.nominalWidthX,
                0 !== _.subrs) {
                    var x = v + _.subrs
                      , b = i(t, x);
                    r.subrs = b.objects,
                    r.subrsBias = g(r.subrs)
                } else
                    r.subrs = [],
                    r.subrsBias = 0;
                var T = i(t, e + l.charStrings);
                r.nGlyphs = T.objects.length;
                var w = f(t, e + l.charset, r.nGlyphs, a.objects);
                0 === l.encoding ? r.cffEncoding = new k.CffEncoding(k.cffStandardEncoding,w) : 1 === l.encoding ? r.cffEncoding = new k.CffEncoding(k.cffExpertEncoding,w) : r.cffEncoding = m(t, e + l.encoding, w),
                r.encoding = r.encoding || r.cffEncoding,
                r.glyphs = new I.GlyphSet(r);
                for (var S = 0; S < r.nGlyphs; S += 1) {
                    var M = T.objects[S];
                    r.glyphs.push(S, I.cffGlyphLoader(r, S, y, M))
                }
            }
            function _(t, e) {
                var r, n = k.cffStandardStrings.indexOf(t);
                return n >= 0 && (r = n),
                n = e.indexOf(t),
                n >= 0 ? r = n + k.cffStandardStrings.length : (r = k.cffStandardStrings.length + e.length,
                e.push(t)),
                r
            }
            function x() {
                return new F.Table("Header",[{
                    name: "major",
                    type: "Card8",
                    value: 1
                }, {
                    name: "minor",
                    type: "Card8",
                    value: 0
                }, {
                    name: "hdrSize",
                    type: "Card8",
                    value: 4
                }, {
                    name: "major",
                    type: "Card8",
                    value: 1
                }])
            }
            function b(t) {
                var e = new F.Table("Name INDEX",[{
                    name: "names",
                    type: "INDEX",
                    value: []
                }]);
                e.names = [];
                for (var r = 0; r < t.length; r += 1)
                    e.names.push({
                        name: "name_" + r,
                        type: "NAME",
                        value: t[r]
                    });
                return e
            }
            function T(t, e, r) {
                for (var i = {}, o = 0; o < t.length; o += 1) {
                    var s = t[o]
                      , a = e[s.name];
                    void 0 === a || n(a, s.value) || ("SID" === s.type && (a = _(a, r)),
                    i[s.op] = {
                        name: s.name,
                        type: s.type,
                        value: a
                    })
                }
                return i
            }
            function w(t, e) {
                var r = new F.Table("Top DICT",[{
                    name: "dict",
                    type: "DICT",
                    value: {}
                }]);
                return r.dict = T(U, t, e),
                r
            }
            function S(t) {
                var e = new F.Table("Top DICT INDEX",[{
                    name: "topDicts",
                    type: "INDEX",
                    value: []
                }]);
                return e.topDicts = [{
                    name: "topDict_0",
                    type: "TABLE",
                    value: t
                }],
                e
            }
            function M(t) {
                var e = new F.Table("String INDEX",[{
                    name: "strings",
                    type: "INDEX",
                    value: []
                }]);
                e.strings = [];
                for (var r = 0; r < t.length; r += 1)
                    e.strings.push({
                        name: "string_" + r,
                        type: "STRING",
                        value: t[r]
                    });
                return e
            }
            function A() {
                return new F.Table("Global Subr INDEX",[{
                    name: "subrs",
                    type: "INDEX",
                    value: []
                }])
            }
            function C(t, e) {
                for (var r = new F.Table("Charsets",[{
                    name: "format",
                    type: "Card8",
                    value: 0
                }]), n = 0; n < t.length; n += 1) {
                    var i = t[n]
                      , o = _(i, e);
                    r.fields.push({
                        name: "glyph_" + n,
                        type: "SID",
                        value: o
                    })
                }
                return r
            }
            function R(t) {
                var e = []
                  , r = t.path;
                e.push({
                    name: "width",
                    type: "NUMBER",
                    value: t.advanceWidth
                });
                for (var n = 0, i = 0, o = 0; o < r.commands.length; o += 1) {
                    var s, a, h = r.commands[o];
                    if ("Q" === h.type) {
                        var u = 1 / 3
                          , l = 2 / 3;
                        h = {
                            type: "C",
                            x: h.x,
                            y: h.y,
                            x1: u * n + l * h.x1,
                            y1: u * i + l * h.y1,
                            x2: u * h.x + l * h.x1,
                            y2: u * h.y + l * h.y1
                        }
                    }
                    if ("M" === h.type)
                        s = Math.round(h.x - n),
                        a = Math.round(h.y - i),
                        e.push({
                            name: "dx",
                            type: "NUMBER",
                            value: s
                        }),
                        e.push({
                            name: "dy",
                            type: "NUMBER",
                            value: a
                        }),
                        e.push({
                            name: "rmoveto",
                            type: "OP",
                            value: 21
                        }),
                        n = Math.round(h.x),
                        i = Math.round(h.y);
                    else if ("L" === h.type)
                        s = Math.round(h.x - n),
                        a = Math.round(h.y - i),
                        e.push({
                            name: "dx",
                            type: "NUMBER",
                            value: s
                        }),
                        e.push({
                            name: "dy",
                            type: "NUMBER",
                            value: a
                        }),
                        e.push({
                            name: "rlineto",
                            type: "OP",
                            value: 5
                        }),
                        n = Math.round(h.x),
                        i = Math.round(h.y);
                    else if ("C" === h.type) {
                        var p = Math.round(h.x1 - n)
                          , c = Math.round(h.y1 - i)
                          , d = Math.round(h.x2 - h.x1)
                          , f = Math.round(h.y2 - h.y1);
                        s = Math.round(h.x - h.x2),
                        a = Math.round(h.y - h.y2),
                        e.push({
                            name: "dx1",
                            type: "NUMBER",
                            value: p
                        }),
                        e.push({
                            name: "dy1",
                            type: "NUMBER",
                            value: c
                        }),
                        e.push({
                            name: "dx2",
                            type: "NUMBER",
                            value: d
                        }),
                        e.push({
                            name: "dy2",
                            type: "NUMBER",
                            value: f
                        }),
                        e.push({
                            name: "dx",
                            type: "NUMBER",
                            value: s
                        }),
                        e.push({
                            name: "dy",
                            type: "NUMBER",
                            value: a
                        }),
                        e.push({
                            name: "rrcurveto",
                            type: "OP",
                            value: 8
                        }),
                        n = Math.round(h.x),
                        i = Math.round(h.y)
                    }
                }
                return e.push({
                    name: "endchar",
                    type: "OP",
                    value: 14
                }),
                e
            }
            function E(t) {
                for (var e = new F.Table("CharStrings INDEX",[{
                    name: "charStrings",
                    type: "INDEX",
                    value: []
                }]), r = 0; r < t.length; r += 1) {
                    var n = t.get(r)
                      , i = R(n);
                    e.charStrings.push({
                        name: n.name,
                        type: "CHARSTRING",
                        value: i
                    })
                }
                return e
            }
            function P(t, e) {
                var r = new F.Table("Private DICT",[{
                    name: "dict",
                    type: "DICT",
                    value: {}
                }]);
                return r.dict = T(B, t, e),
                r
            }
            function N(t) {
                var e = new F.Table("Private DICT INDEX",[{
                    name: "privateDicts",
                    type: "INDEX",
                    value: []
                }]);
                return e.privateDicts = [{
                    name: "privateDict_0",
                    type: "TABLE",
                    value: t
                }],
                e
            }
            function O(t, e) {
                for (var r, n = new F.Table("CFF ",[{
                    name: "header",
                    type: "TABLE"
                }, {
                    name: "nameIndex",
                    type: "TABLE"
                }, {
                    name: "topDictIndex",
                    type: "TABLE"
                }, {
                    name: "stringIndex",
                    type: "TABLE"
                }, {
                    name: "globalSubrIndex",
                    type: "TABLE"
                }, {
                    name: "charsets",
                    type: "TABLE"
                }, {
                    name: "charStringsIndex",
                    type: "TABLE"
                }, {
                    name: "privateDictIndex",
                    type: "TABLE"
                }]), i = 1 / e.unitsPerEm, o = {
                    version: e.version,
                    fullName: e.fullName,
                    familyName: e.familyName,
                    weight: e.weightName,
                    fontMatrix: [i, 0, 0, i, 0, 0],
                    charset: 999,
                    encoding: 0,
                    charStrings: 999,
                    "private": [0, 999]
                }, s = {}, a = [], h = 1; h < t.length; h += 1)
                    r = t.get(h),
                    a.push(r.name);
                var u = [];
                n.header = x(),
                n.nameIndex = b([e.postScriptName]);
                var l = w(o, u);
                n.topDictIndex = S(l),
                n.globalSubrIndex = A(),
                n.charsets = C(a, u),
                n.charStringsIndex = E(t);
                var p = P(s, u);
                n.privateDictIndex = N(p),
                n.stringIndex = M(u);
                var c = n.header.sizeOf() + n.nameIndex.sizeOf() + n.topDictIndex.sizeOf() + n.stringIndex.sizeOf() + n.globalSubrIndex.sizeOf();
                return o.charset = c,
                o.encoding = 0,
                o.charStrings = o.charset + n.charsets.sizeOf(),
                o["private"][1] = o.charStrings + n.charStringsIndex.sizeOf(),
                l = w(o, u),
                n.topDictIndex = S(l),
                n
            }
            var k = t("../encoding")
              , I = t("../glyphset")
              , L = t("../parse")
              , D = t("../path")
              , F = t("../table")
              , U = [{
                name: "version",
                op: 0,
                type: "SID"
            }, {
                name: "notice",
                op: 1,
                type: "SID"
            }, {
                name: "copyright",
                op: 1200,
                type: "SID"
            }, {
                name: "fullName",
                op: 2,
                type: "SID"
            }, {
                name: "familyName",
                op: 3,
                type: "SID"
            }, {
                name: "weight",
                op: 4,
                type: "SID"
            }, {
                name: "isFixedPitch",
                op: 1201,
                type: "number",
                value: 0
            }, {
                name: "italicAngle",
                op: 1202,
                type: "number",
                value: 0
            }, {
                name: "underlinePosition",
                op: 1203,
                type: "number",
                value: -100
            }, {
                name: "underlineThickness",
                op: 1204,
                type: "number",
                value: 50
            }, {
                name: "paintType",
                op: 1205,
                type: "number",
                value: 0
            }, {
                name: "charstringType",
                op: 1206,
                type: "number",
                value: 2
            }, {
                name: "fontMatrix",
                op: 1207,
                type: ["real", "real", "real", "real", "real", "real"],
                value: [.001, 0, 0, .001, 0, 0]
            }, {
                name: "uniqueId",
                op: 13,
                type: "number"
            }, {
                name: "fontBBox",
                op: 5,
                type: ["number", "number", "number", "number"],
                value: [0, 0, 0, 0]
            }, {
                name: "strokeWidth",
                op: 1208,
                type: "number",
                value: 0
            }, {
                name: "xuid",
                op: 14,
                type: [],
                value: null
            }, {
                name: "charset",
                op: 15,
                type: "offset",
                value: 0
            }, {
                name: "encoding",
                op: 16,
                type: "offset",
                value: 0
            }, {
                name: "charStrings",
                op: 17,
                type: "offset",
                value: 0
            }, {
                name: "private",
                op: 18,
                type: ["number", "offset"],
                value: [0, 0]
            }]
              , B = [{
                name: "subrs",
                op: 19,
                type: "offset",
                value: 0
            }, {
                name: "defaultWidthX",
                op: 20,
                type: "number",
                value: 0
            }, {
                name: "nominalWidthX",
                op: 21,
                type: "number",
                value: 0
            }];
            r.parse = v,
            r.make = O
        }
        , {
            "../encoding": 4,
            "../glyphset": 7,
            "../parse": 9,
            "../path": 10,
            "../table": 11
        }],
        13: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                var r, n = {};
                n.version = h.getUShort(t, e),
                a.argument(0 === n.version, "cmap table version should be 0."),
                n.numTables = h.getUShort(t, e + 2);
                var i = -1;
                for (r = 0; r < n.numTables; r += 1) {
                    var o = h.getUShort(t, e + 4 + 8 * r)
                      , s = h.getUShort(t, e + 4 + 8 * r + 2);
                    if (3 === o && (1 === s || 0 === s)) {
                        i = h.getULong(t, e + 4 + 8 * r + 4);
                        break
                    }
                }
                if (-1 === i)
                    return null;
                var u = new h.Parser(t,e + i);
                n.format = u.parseUShort(),
                a.argument(4 === n.format, "Only format 4 cmap tables are supported."),
                n.length = u.parseUShort(),
                n.language = u.parseUShort();
                var l;
                n.segCount = l = u.parseUShort() >> 1,
                u.skip("uShort", 3),
                n.glyphIndexMap = {};
                var p = new h.Parser(t,e + i + 14)
                  , c = new h.Parser(t,e + i + 16 + 2 * l)
                  , d = new h.Parser(t,e + i + 16 + 4 * l)
                  , f = new h.Parser(t,e + i + 16 + 6 * l)
                  , m = e + i + 16 + 8 * l;
                for (r = 0; l - 1 > r; r += 1)
                    for (var y, g = p.parseUShort(), v = c.parseUShort(), _ = d.parseShort(), x = f.parseUShort(), b = v; g >= b; b += 1)
                        0 !== x ? (m = f.offset + f.relativeOffset - 2,
                        m += x,
                        m += 2 * (b - v),
                        y = h.getUShort(t, m),
                        0 !== y && (y = y + _ & 65535)) : y = b + _ & 65535,
                        n.glyphIndexMap[b] = y;
                return n
            }
            function i(t, e, r) {
                t.segments.push({
                    end: e,
                    start: e,
                    delta: -(e - r),
                    offset: 0
                })
            }
            function o(t) {
                t.segments.push({
                    end: 65535,
                    start: 65535,
                    delta: 1,
                    offset: 0
                })
            }
            function s(t) {
                var e, r = new u.Table("cmap",[{
                    name: "version",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "numTables",
                    type: "USHORT",
                    value: 1
                }, {
                    name: "platformID",
                    type: "USHORT",
                    value: 3
                }, {
                    name: "encodingID",
                    type: "USHORT",
                    value: 1
                }, {
                    name: "offset",
                    type: "ULONG",
                    value: 12
                }, {
                    name: "format",
                    type: "USHORT",
                    value: 4
                }, {
                    name: "length",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "language",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "segCountX2",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "searchRange",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "entrySelector",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "rangeShift",
                    type: "USHORT",
                    value: 0
                }]);
                for (r.segments = [],
                e = 0; e < t.length; e += 1) {
                    for (var n = t.get(e), s = 0; s < n.unicodes.length; s += 1)
                        i(r, n.unicodes[s], e);
                    r.segments = r.segments.sort(function(t, e) {
                        return t.start - e.start
                    })
                }
                o(r);
                var a;
                a = r.segments.length,
                r.segCountX2 = 2 * a,
                r.searchRange = 2 * Math.pow(2, Math.floor(Math.log(a) / Math.log(2))),
                r.entrySelector = Math.log(r.searchRange / 2) / Math.log(2),
                r.rangeShift = r.segCountX2 - r.searchRange;
                var h = []
                  , l = []
                  , p = []
                  , c = []
                  , d = [];
                for (e = 0; a > e; e += 1) {
                    var f = r.segments[e];
                    h = h.concat({
                        name: "end_" + e,
                        type: "USHORT",
                        value: f.end
                    }),
                    l = l.concat({
                        name: "start_" + e,
                        type: "USHORT",
                        value: f.start
                    }),
                    p = p.concat({
                        name: "idDelta_" + e,
                        type: "SHORT",
                        value: f.delta
                    }),
                    c = c.concat({
                        name: "idRangeOffset_" + e,
                        type: "USHORT",
                        value: f.offset
                    }),
                    void 0 !== f.glyphId && (d = d.concat({
                        name: "glyph_" + e,
                        type: "USHORT",
                        value: f.glyphId
                    }))
                }
                return r.fields = r.fields.concat(h),
                r.fields.push({
                    name: "reservedPad",
                    type: "USHORT",
                    value: 0
                }),
                r.fields = r.fields.concat(l),
                r.fields = r.fields.concat(p),
                r.fields = r.fields.concat(c),
                r.fields = r.fields.concat(d),
                r.length = 14 + 2 * h.length + 2 + 2 * l.length + 2 * p.length + 2 * c.length + 2 * d.length,
                r
            }
            var a = t("../check")
              , h = t("../parse")
              , u = t("../table");
            r.parse = n,
            r.make = s
        }
        , {
            "../check": 2,
            "../parse": 9,
            "../table": 11
        }],
        14: [function(t, e, r) {
            "use strict";
            function n(t, e, r, n, i) {
                var o;
                return (e & n) > 0 ? (o = t.parseByte(),
                0 === (e & i) && (o = -o),
                o = r + o) : o = (e & i) > 0 ? r : r + t.parseShort(),
                o
            }
            function i(t, e, r) {
                var i = new c.Parser(e,r);
                t.numberOfContours = i.parseShort(),
                t.xMin = i.parseShort(),
                t.yMin = i.parseShort(),
                t.xMax = i.parseShort(),
                t.yMax = i.parseShort();
                var o, s;
                if (t.numberOfContours > 0) {
                    var a, h = t.endPointIndices = [];
                    for (a = 0; a < t.numberOfContours; a += 1)
                        h.push(i.parseUShort());
                    for (t.instructionLength = i.parseUShort(),
                    t.instructions = [],
                    a = 0; a < t.instructionLength; a += 1)
                        t.instructions.push(i.parseByte());
                    var u = h[h.length - 1] + 1;
                    for (o = [],
                    a = 0; u > a; a += 1)
                        if (s = i.parseByte(),
                        o.push(s),
                        (8 & s) > 0)
                            for (var p = i.parseByte(), d = 0; p > d; d += 1)
                                o.push(s),
                                a += 1;
                    if (l.argument(o.length === u, "Bad flags."),
                    h.length > 0) {
                        var f, m = [];
                        if (u > 0) {
                            for (a = 0; u > a; a += 1)
                                s = o[a],
                                f = {},
                                f.onCurve = !!(1 & s),
                                f.lastPointOfContour = h.indexOf(a) >= 0,
                                m.push(f);
                            var y = 0;
                            for (a = 0; u > a; a += 1)
                                s = o[a],
                                f = m[a],
                                f.x = n(i, s, y, 2, 16),
                                y = f.x;
                            var g = 0;
                            for (a = 0; u > a; a += 1)
                                s = o[a],
                                f = m[a],
                                f.y = n(i, s, g, 4, 32),
                                g = f.y
                        }
                        t.points = m
                    } else
                        t.points = []
                } else if (0 === t.numberOfContours)
                    t.points = [];
                else {
                    t.isComposite = !0,
                    t.points = [],
                    t.components = [];
                    for (var v = !0; v; ) {
                        o = i.parseUShort();
                        var _ = {
                            glyphIndex: i.parseUShort(),
                            xScale: 1,
                            scale01: 0,
                            scale10: 0,
                            yScale: 1,
                            dx: 0,
                            dy: 0
                        };
                        (1 & o) > 0 ? (_.dx = i.parseShort(),
                        _.dy = i.parseShort()) : (_.dx = i.parseChar(),
                        _.dy = i.parseChar()),
                        (8 & o) > 0 ? _.xScale = _.yScale = i.parseF2Dot14() : (64 & o) > 0 ? (_.xScale = i.parseF2Dot14(),
                        _.yScale = i.parseF2Dot14()) : (128 & o) > 0 && (_.xScale = i.parseF2Dot14(),
                        _.scale01 = i.parseF2Dot14(),
                        _.scale10 = i.parseF2Dot14(),
                        _.yScale = i.parseF2Dot14()),
                        t.components.push(_),
                        v = !!(32 & o)
                    }
                }
            }
            function o(t, e) {
                for (var r = [], n = 0; n < t.length; n += 1) {
                    var i = t[n]
                      , o = {
                        x: e.xScale * i.x + e.scale01 * i.y + e.dx,
                        y: e.scale10 * i.x + e.yScale * i.y + e.dy,
                        onCurve: i.onCurve,
                        lastPointOfContour: i.lastPointOfContour
                    };
                    r.push(o)
                }
                return r
            }
            function s(t) {
                for (var e = [], r = [], n = 0; n < t.length; n += 1) {
                    var i = t[n];
                    r.push(i),
                    i.lastPointOfContour && (e.push(r),
                    r = [])
                }
                return l.argument(0 === r.length, "There are still points left in the current contour."),
                e
            }
            function a(t) {
                var e = new d.Path;
                if (!t)
                    return e;
                for (var r = s(t), n = 0; n < r.length; n += 1) {
                    var i, o, a = r[n], h = a[0], u = a[a.length - 1];
                    h.onCurve ? (i = null,
                    o = !0) : (h = u.onCurve ? u : {
                        x: (h.x + u.x) / 2,
                        y: (h.y + u.y) / 2
                    },
                    i = h,
                    o = !1),
                    e.moveTo(h.x, h.y);
                    for (var l = o ? 1 : 0; l < a.length; l += 1) {
                        var p = a[l]
                          , c = 0 === l ? h : a[l - 1];
                        if (c.onCurve && p.onCurve)
                            e.lineTo(p.x, p.y);
                        else if (c.onCurve && !p.onCurve)
                            i = p;
                        else if (c.onCurve || p.onCurve) {
                            if (c.onCurve || !p.onCurve)
                                throw new Error("Invalid state.");
                            e.quadraticCurveTo(i.x, i.y, p.x, p.y),
                            i = null
                        } else {
                            var f = {
                                x: (c.x + p.x) / 2,
                                y: (c.y + p.y) / 2
                            };
                            e.quadraticCurveTo(c.x, c.y, f.x, f.y),
                            i = p
                        }
                    }
                    h !== u && (i ? e.quadraticCurveTo(i.x, i.y, h.x, h.y) : e.lineTo(h.x, h.y))
                }
                return e.closePath(),
                e
            }
            function h(t, e) {
                if (e.isComposite)
                    for (var r = 0; r < e.components.length; r += 1) {
                        var n = e.components[r]
                          , i = t.get(n.glyphIndex);
                        if (i.points) {
                            var s = o(i.points, n);
                            e.points = e.points.concat(s)
                        }
                    }
                return a(e.points)
            }
            function u(t, e, r, n) {
                var o, s = new p.GlyphSet(n);
                for (o = 0; o < r.length - 1; o += 1) {
                    var a = r[o]
                      , u = r[o + 1];
                    a !== u ? s.push(o, p.ttfGlyphLoader(n, o, i, t, e + a, h)) : s.push(o, p.glyphLoader(n, o))
                }
                return s
            }
            var l = t("../check")
              , p = t("../glyphset")
              , c = t("../parse")
              , d = t("../path");
            r.parse = u
        }
        , {
            "../check": 2,
            "../glyphset": 7,
            "../parse": 9,
            "../path": 10
        }],
        15: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                for (var r = new l.Parser(t,e), n = r.parseUShort(), i = [], o = 0; n > o; o++)
                    i[r.parseTag()] = {
                        offset: r.parseUShort()
                    };
                return i
            }
            function i(t, e) {
                var r = new l.Parser(t,e)
                  , n = r.parseUShort()
                  , i = r.parseUShort();
                if (1 === n)
                    return r.parseUShortList(i);
                if (2 === n) {
                    for (var o = []; i--; )
                        for (var s = r.parseUShort(), a = r.parseUShort(), h = r.parseUShort(), u = s; a >= u; u++)
                            o[h++] = u;
                    return o
                }
            }
            function o(t, e) {
                var r = new l.Parser(t,e)
                  , n = r.parseUShort();
                if (1 === n) {
                    var i = r.parseUShort()
                      , o = r.parseUShort()
                      , s = r.parseUShortList(o);
                    return function(t) {
                        return s[t - i] || 0
                    }
                }
                if (2 === n) {
                    for (var a = r.parseUShort(), h = [], u = [], p = [], c = 0; a > c; c++)
                        h[c] = r.parseUShort(),
                        u[c] = r.parseUShort(),
                        p[c] = r.parseUShort();
                    return function(t) {
                        for (var e = 0, r = h.length - 1; r > e; ) {
                            var n = e + r + 1 >> 1;
                            t < h[n] ? r = n - 1 : e = n
                        }
                        return h[e] <= t && t <= u[e] ? p[e] || 0 : 0
                    }
                }
            }
            function s(t, e) {
                var r, n, s = new l.Parser(t,e), a = s.parseUShort(), h = s.parseUShort(), u = i(t, e + h), p = s.parseUShort(), c = s.parseUShort();
                if (4 === p && 0 === c) {
                    var d = {};
                    if (1 === a) {
                        for (var f = s.parseUShort(), m = [], y = s.parseOffset16List(f), g = 0; f > g; g++) {
                            var v = y[g]
                              , _ = d[v];
                            if (!_) {
                                _ = {},
                                s.relativeOffset = v;
                                for (var x = s.parseUShort(); x--; ) {
                                    var b = s.parseUShort();
                                    p && (r = s.parseShort()),
                                    c && (n = s.parseShort()),
                                    _[b] = r
                                }
                            }
                            m[u[g]] = _
                        }
                        return function(t, e) {
                            var r = m[t];
                            return r ? r[e] : void 0
                        }
                    }
                    if (2 === a) {
                        for (var T = s.parseUShort(), w = s.parseUShort(), S = s.parseUShort(), M = s.parseUShort(), A = o(t, e + T), C = o(t, e + w), R = [], E = 0; S > E; E++)
                            for (var P = R[E] = [], N = 0; M > N; N++)
                                p && (r = s.parseShort()),
                                c && (n = s.parseShort()),
                                P[N] = r;
                        var O = {};
                        for (E = 0; E < u.length; E++)
                            O[u[E]] = 1;
                        return function(t, e) {
                            if (O[t]) {
                                var r = A(t)
                                  , n = C(e)
                                  , i = R[r];
                                return i ? i[n] : void 0
                            }
                        }
                    }
                }
            }
            function a(t, e) {
                var r = new l.Parser(t,e)
                  , n = r.parseUShort()
                  , i = r.parseUShort()
                  , o = 16 & i
                  , a = r.parseUShort()
                  , h = r.parseOffset16List(a)
                  , u = {
                    lookupType: n,
                    lookupFlag: i,
                    markFilteringSet: o ? r.parseUShort() : -1
                };
                if (2 === n) {
                    for (var p = [], c = 0; a > c; c++)
                        p.push(s(t, e + h[c]));
                    u.getKerningValue = function(t, e) {
                        for (var r = p.length; r--; ) {
                            var n = p[r](t, e);
                            if (void 0 !== n)
                                return n
                        }
                        return 0
                    }
                }
                return u
            }
            function h(t, e, r) {
                var i = new l.Parser(t,e)
                  , o = i.parseFixed();
                u.argument(1 === o, "Unsupported GPOS table version."),
                n(t, e + i.parseUShort()),
                n(t, e + i.parseUShort());
                var s = i.parseUShort();
                i.relativeOffset = s;
                for (var h = i.parseUShort(), p = i.parseOffset16List(h), c = e + s, d = 0; h > d; d++) {
                    var f = a(t, c + p[d]);
                    2 !== f.lookupType || r.getGposKerningValue || (r.getGposKerningValue = f.getKerningValue)
                }
            }
            var u = t("../check")
              , l = t("../parse");
            r.parse = h
        }
        , {
            "../check": 2,
            "../parse": 9
        }],
        16: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                var r = {}
                  , n = new s.Parser(t,e);
                return r.version = n.parseVersion(),
                r.fontRevision = Math.round(1e3 * n.parseFixed()) / 1e3,
                r.checkSumAdjustment = n.parseULong(),
                r.magicNumber = n.parseULong(),
                o.argument(1594834165 === r.magicNumber, "Font header has wrong magic number."),
                r.flags = n.parseUShort(),
                r.unitsPerEm = n.parseUShort(),
                r.created = n.parseLongDateTime(),
                r.modified = n.parseLongDateTime(),
                r.xMin = n.parseShort(),
                r.yMin = n.parseShort(),
                r.xMax = n.parseShort(),
                r.yMax = n.parseShort(),
                r.macStyle = n.parseUShort(),
                r.lowestRecPPEM = n.parseUShort(),
                r.fontDirectionHint = n.parseShort(),
                r.indexToLocFormat = n.parseShort(),
                r.glyphDataFormat = n.parseShort(),
                r
            }
            function i(t) {
                return new a.Table("head",[{
                    name: "version",
                    type: "FIXED",
                    value: 65536
                }, {
                    name: "fontRevision",
                    type: "FIXED",
                    value: 65536
                }, {
                    name: "checkSumAdjustment",
                    type: "ULONG",
                    value: 0
                }, {
                    name: "magicNumber",
                    type: "ULONG",
                    value: 1594834165
                }, {
                    name: "flags",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "unitsPerEm",
                    type: "USHORT",
                    value: 1e3
                }, {
                    name: "created",
                    type: "LONGDATETIME",
                    value: 0
                }, {
                    name: "modified",
                    type: "LONGDATETIME",
                    value: 0
                }, {
                    name: "xMin",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "yMin",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "xMax",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "yMax",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "macStyle",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "lowestRecPPEM",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "fontDirectionHint",
                    type: "SHORT",
                    value: 2
                }, {
                    name: "indexToLocFormat",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "glyphDataFormat",
                    type: "SHORT",
                    value: 0
                }],t)
            }
            var o = t("../check")
              , s = t("../parse")
              , a = t("../table");
            r.parse = n,
            r.make = i
        }
        , {
            "../check": 2,
            "../parse": 9,
            "../table": 11
        }],
        17: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                var r = {}
                  , n = new o.Parser(t,e);
                return r.version = n.parseVersion(),
                r.ascender = n.parseShort(),
                r.descender = n.parseShort(),
                r.lineGap = n.parseShort(),
                r.advanceWidthMax = n.parseUShort(),
                r.minLeftSideBearing = n.parseShort(),
                r.minRightSideBearing = n.parseShort(),
                r.xMaxExtent = n.parseShort(),
                r.caretSlopeRise = n.parseShort(),
                r.caretSlopeRun = n.parseShort(),
                r.caretOffset = n.parseShort(),
                n.relativeOffset += 8,
                r.metricDataFormat = n.parseShort(),
                r.numberOfHMetrics = n.parseUShort(),
                r
            }
            function i(t) {
                return new s.Table("hhea",[{
                    name: "version",
                    type: "FIXED",
                    value: 65536
                }, {
                    name: "ascender",
                    type: "FWORD",
                    value: 0
                }, {
                    name: "descender",
                    type: "FWORD",
                    value: 0
                }, {
                    name: "lineGap",
                    type: "FWORD",
                    value: 0
                }, {
                    name: "advanceWidthMax",
                    type: "UFWORD",
                    value: 0
                }, {
                    name: "minLeftSideBearing",
                    type: "FWORD",
                    value: 0
                }, {
                    name: "minRightSideBearing",
                    type: "FWORD",
                    value: 0
                }, {
                    name: "xMaxExtent",
                    type: "FWORD",
                    value: 0
                }, {
                    name: "caretSlopeRise",
                    type: "SHORT",
                    value: 1
                }, {
                    name: "caretSlopeRun",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "caretOffset",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "reserved1",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "reserved2",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "reserved3",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "reserved4",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "metricDataFormat",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "numberOfHMetrics",
                    type: "USHORT",
                    value: 0
                }],t)
            }
            var o = t("../parse")
              , s = t("../table");
            r.parse = n,
            r.make = i
        }
        , {
            "../parse": 9,
            "../table": 11
        }],
        18: [function(t, e, r) {
            "use strict";
            function n(t, e, r, n, i) {
                for (var s, a, h = new o.Parser(t,e), u = 0; n > u; u += 1) {
                    r > u && (s = h.parseUShort(),
                    a = h.parseShort());
                    var l = i.get(u);
                    l.advanceWidth = s,
                    l.leftSideBearing = a
                }
            }
            function i(t) {
                for (var e = new s.Table("hmtx",[]), r = 0; r < t.length; r += 1) {
                    var n = t.get(r)
                      , i = n.advanceWidth || 0
                      , o = n.leftSideBearing || 0;
                    e.fields.push({
                        name: "advanceWidth_" + r,
                        type: "USHORT",
                        value: i
                    }),
                    e.fields.push({
                        name: "leftSideBearing_" + r,
                        type: "SHORT",
                        value: o
                    })
                }
                return e
            }
            var o = t("../parse")
              , s = t("../table");
            r.parse = n,
            r.make = i
        }
        , {
            "../parse": 9,
            "../table": 11
        }],
        19: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                var r = {}
                  , n = new o.Parser(t,e)
                  , s = n.parseUShort();
                i.argument(0 === s, "Unsupported kern table version."),
                n.skip("uShort", 1);
                var a = n.parseUShort();
                i.argument(0 === a, "Unsupported kern sub-table version."),
                n.skip("uShort", 2);
                var h = n.parseUShort();
                n.skip("uShort", 3);
                for (var u = 0; h > u; u += 1) {
                    var l = n.parseUShort()
                      , p = n.parseUShort()
                      , c = n.parseShort();
                    r[l + "," + p] = c
                }
                return r
            }
            var i = t("../check")
              , o = t("../parse");
            r.parse = n
        }
        , {
            "../check": 2,
            "../parse": 9
        }],
        20: [function(t, e, r) {
            "use strict";
            function n(t, e, r, n) {
                for (var o = new i.Parser(t,e), s = n ? o.parseUShort : o.parseULong, a = [], h = 0; r + 1 > h; h += 1) {
                    var u = s.call(o);
                    n && (u *= 2),
                    a.push(u)
                }
                return a
            }
            var i = t("../parse");
            r.parse = n
        }
        , {
            "../parse": 9
        }],
        21: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                var r = {}
                  , n = new o.Parser(t,e);
                return r.version = n.parseVersion(),
                r.numGlyphs = n.parseUShort(),
                1 === r.version && (r.maxPoints = n.parseUShort(),
                r.maxContours = n.parseUShort(),
                r.maxCompositePoints = n.parseUShort(),
                r.maxCompositeContours = n.parseUShort(),
                r.maxZones = n.parseUShort(),
                r.maxTwilightPoints = n.parseUShort(),
                r.maxStorage = n.parseUShort(),
                r.maxFunctionDefs = n.parseUShort(),
                r.maxInstructionDefs = n.parseUShort(),
                r.maxStackElements = n.parseUShort(),
                r.maxSizeOfInstructions = n.parseUShort(),
                r.maxComponentElements = n.parseUShort(),
                r.maxComponentDepth = n.parseUShort()),
                r
            }
            function i(t) {
                return new s.Table("maxp",[{
                    name: "version",
                    type: "FIXED",
                    value: 20480
                }, {
                    name: "numGlyphs",
                    type: "USHORT",
                    value: t
                }])
            }
            var o = t("../parse")
              , s = t("../table");
            r.parse = n,
            r.make = i
        }
        , {
            "../parse": 9,
            "../table": 11
        }],
        22: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                var r = {}
                  , n = new u.Parser(t,e);
                r.format = n.parseUShort();
                for (var i = n.parseUShort(), o = n.offset + n.parseUShort(), s = 0, a = 0; i > a; a++) {
                    var h = n.parseUShort()
                      , l = n.parseUShort()
                      , c = n.parseUShort()
                      , d = n.parseUShort()
                      , f = p[d]
                      , m = n.parseUShort()
                      , y = n.parseUShort();
                    if (3 === h && 1 === l && 1033 === c) {
                        for (var g = [], v = m / 2, _ = 0; v > _; _++,
                        y += 2)
                            g[_] = u.getShort(t, o + y);
                        var x = String.fromCharCode.apply(null, g);
                        f ? r[f] = x : (s++,
                        r["unknown" + s] = x)
                    }
                }
                return 1 === r.format && (r.langTagCount = n.parseUShort()),
                r
            }
            function i(t, e, r, n, i, o) {
                return new l.Table("NameRecord",[{
                    name: "platformID",
                    type: "USHORT",
                    value: t
                }, {
                    name: "encodingID",
                    type: "USHORT",
                    value: e
                }, {
                    name: "languageID",
                    type: "USHORT",
                    value: r
                }, {
                    name: "nameID",
                    type: "USHORT",
                    value: n
                }, {
                    name: "length",
                    type: "USHORT",
                    value: i
                }, {
                    name: "offset",
                    type: "USHORT",
                    value: o
                }])
            }
            function o(t, e, r, n) {
                var o = h.STRING(r);
                return t.records.push(i(1, 0, 0, e, o.length, n)),
                t.strings.push(o),
                n += o.length
            }
            function s(t, e, r, n) {
                var o = h.UTF16(r);
                return t.records.push(i(3, 1, 1033, e, o.length, n)),
                t.strings.push(o),
                n += o.length
            }
            function a(t) {
                var e = new l.Table("name",[{
                    name: "format",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "count",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "stringOffset",
                    type: "USHORT",
                    value: 0
                }]);
                e.records = [],
                e.strings = [];
                var r, n, i = 0;
                for (r = 0; r < p.length; r += 1)
                    void 0 !== t[p[r]] && (n = t[p[r]],
                    i = o(e, r, n, i));
                for (r = 0; r < p.length; r += 1)
                    void 0 !== t[p[r]] && (n = t[p[r]],
                    i = s(e, r, n, i));
                for (e.count = e.records.length,
                e.stringOffset = 6 + 12 * e.count,
                r = 0; r < e.records.length; r += 1)
                    e.fields.push({
                        name: "record_" + r,
                        type: "TABLE",
                        value: e.records[r]
                    });
                for (r = 0; r < e.strings.length; r += 1)
                    e.fields.push({
                        name: "string_" + r,
                        type: "LITERAL",
                        value: e.strings[r]
                    });
                return e
            }
            var h = t("../types").encode
              , u = t("../parse")
              , l = t("../table")
              , p = ["copyright", "fontFamily", "fontSubfamily", "uniqueID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "manufacturerURL", "designerURL", "licence", "licenceURL", "reserved", "preferredFamily", "preferredSubfamily", "compatibleFullName", "sampleText", "postScriptFindFontName", "wwsFamily", "wwsSubfamily"];
            r.parse = n,
            r.make = a
        }
        , {
            "../parse": 9,
            "../table": 11,
            "../types": 26
        }],
        23: [function(t, e, r) {
            "use strict";
            function n(t) {
                for (var e = 0; e < h.length; e += 1) {
                    var r = h[e];
                    if (t >= r.begin && t < r.end)
                        return e
                }
                return -1
            }
            function i(t, e) {
                var r = {}
                  , n = new s.Parser(t,e);
                r.version = n.parseUShort(),
                r.xAvgCharWidth = n.parseShort(),
                r.usWeightClass = n.parseUShort(),
                r.usWidthClass = n.parseUShort(),
                r.fsType = n.parseUShort(),
                r.ySubscriptXSize = n.parseShort(),
                r.ySubscriptYSize = n.parseShort(),
                r.ySubscriptXOffset = n.parseShort(),
                r.ySubscriptYOffset = n.parseShort(),
                r.ySuperscriptXSize = n.parseShort(),
                r.ySuperscriptYSize = n.parseShort(),
                r.ySuperscriptXOffset = n.parseShort(),
                r.ySuperscriptYOffset = n.parseShort(),
                r.yStrikeoutSize = n.parseShort(),
                r.yStrikeoutPosition = n.parseShort(),
                r.sFamilyClass = n.parseShort(),
                r.panose = [];
                for (var i = 0; 10 > i; i++)
                    r.panose[i] = n.parseByte();
                return r.ulUnicodeRange1 = n.parseULong(),
                r.ulUnicodeRange2 = n.parseULong(),
                r.ulUnicodeRange3 = n.parseULong(),
                r.ulUnicodeRange4 = n.parseULong(),
                r.achVendID = String.fromCharCode(n.parseByte(), n.parseByte(), n.parseByte(), n.parseByte()),
                r.fsSelection = n.parseUShort(),
                r.usFirstCharIndex = n.parseUShort(),
                r.usLastCharIndex = n.parseUShort(),
                r.sTypoAscender = n.parseShort(),
                r.sTypoDescender = n.parseShort(),
                r.sTypoLineGap = n.parseShort(),
                r.usWinAscent = n.parseUShort(),
                r.usWinDescent = n.parseUShort(),
                r.version >= 1 && (r.ulCodePageRange1 = n.parseULong(),
                r.ulCodePageRange2 = n.parseULong()),
                r.version >= 2 && (r.sxHeight = n.parseShort(),
                r.sCapHeight = n.parseShort(),
                r.usDefaultChar = n.parseUShort(),
                r.usBreakChar = n.parseUShort(),
                r.usMaxContent = n.parseUShort()),
                r
            }
            function o(t) {
                return new a.Table("OS/2",[{
                    name: "version",
                    type: "USHORT",
                    value: 3
                }, {
                    name: "xAvgCharWidth",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "usWeightClass",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "usWidthClass",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "fsType",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "ySubscriptXSize",
                    type: "SHORT",
                    value: 650
                }, {
                    name: "ySubscriptYSize",
                    type: "SHORT",
                    value: 699
                }, {
                    name: "ySubscriptXOffset",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "ySubscriptYOffset",
                    type: "SHORT",
                    value: 140
                }, {
                    name: "ySuperscriptXSize",
                    type: "SHORT",
                    value: 650
                }, {
                    name: "ySuperscriptYSize",
                    type: "SHORT",
                    value: 699
                }, {
                    name: "ySuperscriptXOffset",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "ySuperscriptYOffset",
                    type: "SHORT",
                    value: 479
                }, {
                    name: "yStrikeoutSize",
                    type: "SHORT",
                    value: 49
                }, {
                    name: "yStrikeoutPosition",
                    type: "SHORT",
                    value: 258
                }, {
                    name: "sFamilyClass",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "bFamilyType",
                    type: "BYTE",
                    value: 0
                }, {
                    name: "bSerifStyle",
                    type: "BYTE",
                    value: 0
                }, {
                    name: "bWeight",
                    type: "BYTE",
                    value: 0
                }, {
                    name: "bProportion",
                    type: "BYTE",
                    value: 0
                }, {
                    name: "bContrast",
                    type: "BYTE",
                    value: 0
                }, {
                    name: "bStrokeVariation",
                    type: "BYTE",
                    value: 0
                }, {
                    name: "bArmStyle",
                    type: "BYTE",
                    value: 0
                }, {
                    name: "bLetterform",
                    type: "BYTE",
                    value: 0
                }, {
                    name: "bMidline",
                    type: "BYTE",
                    value: 0
                }, {
                    name: "bXHeight",
                    type: "BYTE",
                    value: 0
                }, {
                    name: "ulUnicodeRange1",
                    type: "ULONG",
                    value: 0
                }, {
                    name: "ulUnicodeRange2",
                    type: "ULONG",
                    value: 0
                }, {
                    name: "ulUnicodeRange3",
                    type: "ULONG",
                    value: 0
                }, {
                    name: "ulUnicodeRange4",
                    type: "ULONG",
                    value: 0
                }, {
                    name: "achVendID",
                    type: "CHARARRAY",
                    value: "XXXX"
                }, {
                    name: "fsSelection",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "usFirstCharIndex",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "usLastCharIndex",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "sTypoAscender",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "sTypoDescender",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "sTypoLineGap",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "usWinAscent",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "usWinDescent",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "ulCodePageRange1",
                    type: "ULONG",
                    value: 0
                }, {
                    name: "ulCodePageRange2",
                    type: "ULONG",
                    value: 0
                }, {
                    name: "sxHeight",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "sCapHeight",
                    type: "SHORT",
                    value: 0
                }, {
                    name: "usDefaultChar",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "usBreakChar",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "usMaxContext",
                    type: "USHORT",
                    value: 0
                }],t)
            }
            var s = t("../parse")
              , a = t("../table")
              , h = [{
                begin: 0,
                end: 127
            }, {
                begin: 128,
                end: 255
            }, {
                begin: 256,
                end: 383
            }, {
                begin: 384,
                end: 591
            }, {
                begin: 592,
                end: 687
            }, {
                begin: 688,
                end: 767
            }, {
                begin: 768,
                end: 879
            }, {
                begin: 880,
                end: 1023
            }, {
                begin: 11392,
                end: 11519
            }, {
                begin: 1024,
                end: 1279
            }, {
                begin: 1328,
                end: 1423
            }, {
                begin: 1424,
                end: 1535
            }, {
                begin: 42240,
                end: 42559
            }, {
                begin: 1536,
                end: 1791
            }, {
                begin: 1984,
                end: 2047
            }, {
                begin: 2304,
                end: 2431
            }, {
                begin: 2432,
                end: 2559
            }, {
                begin: 2560,
                end: 2687
            }, {
                begin: 2688,
                end: 2815
            }, {
                begin: 2816,
                end: 2943
            }, {
                begin: 2944,
                end: 3071
            }, {
                begin: 3072,
                end: 3199
            }, {
                begin: 3200,
                end: 3327
            }, {
                begin: 3328,
                end: 3455
            }, {
                begin: 3584,
                end: 3711
            }, {
                begin: 3712,
                end: 3839
            }, {
                begin: 4256,
                end: 4351
            }, {
                begin: 6912,
                end: 7039
            }, {
                begin: 4352,
                end: 4607
            }, {
                begin: 7680,
                end: 7935
            }, {
                begin: 7936,
                end: 8191
            }, {
                begin: 8192,
                end: 8303
            }, {
                begin: 8304,
                end: 8351
            }, {
                begin: 8352,
                end: 8399
            }, {
                begin: 8400,
                end: 8447
            }, {
                begin: 8448,
                end: 8527
            }, {
                begin: 8528,
                end: 8591
            }, {
                begin: 8592,
                end: 8703
            }, {
                begin: 8704,
                end: 8959
            }, {
                begin: 8960,
                end: 9215
            }, {
                begin: 9216,
                end: 9279
            }, {
                begin: 9280,
                end: 9311
            }, {
                begin: 9312,
                end: 9471
            }, {
                begin: 9472,
                end: 9599
            }, {
                begin: 9600,
                end: 9631
            }, {
                begin: 9632,
                end: 9727
            }, {
                begin: 9728,
                end: 9983
            }, {
                begin: 9984,
                end: 10175
            }, {
                begin: 12288,
                end: 12351
            }, {
                begin: 12352,
                end: 12447
            }, {
                begin: 12448,
                end: 12543
            }, {
                begin: 12544,
                end: 12591
            }, {
                begin: 12592,
                end: 12687
            }, {
                begin: 43072,
                end: 43135
            }, {
                begin: 12800,
                end: 13055
            }, {
                begin: 13056,
                end: 13311
            }, {
                begin: 44032,
                end: 55215
            }, {
                begin: 55296,
                end: 57343
            }, {
                begin: 67840,
                end: 67871
            }, {
                begin: 19968,
                end: 40959
            }, {
                begin: 57344,
                end: 63743
            }, {
                begin: 12736,
                end: 12783
            }, {
                begin: 64256,
                end: 64335
            }, {
                begin: 64336,
                end: 65023
            }, {
                begin: 65056,
                end: 65071
            }, {
                begin: 65040,
                end: 65055
            }, {
                begin: 65104,
                end: 65135
            }, {
                begin: 65136,
                end: 65279
            }, {
                begin: 65280,
                end: 65519
            }, {
                begin: 65520,
                end: 65535
            }, {
                begin: 3840,
                end: 4095
            }, {
                begin: 1792,
                end: 1871
            }, {
                begin: 1920,
                end: 1983
            }, {
                begin: 3456,
                end: 3583
            }, {
                begin: 4096,
                end: 4255
            }, {
                begin: 4608,
                end: 4991
            }, {
                begin: 5024,
                end: 5119
            }, {
                begin: 5120,
                end: 5759
            }, {
                begin: 5760,
                end: 5791
            }, {
                begin: 5792,
                end: 5887
            }, {
                begin: 6016,
                end: 6143
            }, {
                begin: 6144,
                end: 6319
            }, {
                begin: 10240,
                end: 10495
            }, {
                begin: 40960,
                end: 42127
            }, {
                begin: 5888,
                end: 5919
            }, {
                begin: 66304,
                end: 66351
            }, {
                begin: 66352,
                end: 66383
            }, {
                begin: 66560,
                end: 66639
            }, {
                begin: 118784,
                end: 119039
            }, {
                begin: 119808,
                end: 120831
            }, {
                begin: 1044480,
                end: 1048573
            }, {
                begin: 65024,
                end: 65039
            }, {
                begin: 917504,
                end: 917631
            }, {
                begin: 6400,
                end: 6479
            }, {
                begin: 6480,
                end: 6527
            }, {
                begin: 6528,
                end: 6623
            }, {
                begin: 6656,
                end: 6687
            }, {
                begin: 11264,
                end: 11359
            }, {
                begin: 11568,
                end: 11647
            }, {
                begin: 19904,
                end: 19967
            }, {
                begin: 43008,
                end: 43055
            }, {
                begin: 65536,
                end: 65663
            }, {
                begin: 65856,
                end: 65935
            }, {
                begin: 66432,
                end: 66463
            }, {
                begin: 66464,
                end: 66527
            }, {
                begin: 66640,
                end: 66687
            }, {
                begin: 66688,
                end: 66735
            }, {
                begin: 67584,
                end: 67647
            }, {
                begin: 68096,
                end: 68191
            }, {
                begin: 119552,
                end: 119647
            }, {
                begin: 73728,
                end: 74751
            }, {
                begin: 119648,
                end: 119679
            }, {
                begin: 7040,
                end: 7103
            }, {
                begin: 7168,
                end: 7247
            }, {
                begin: 7248,
                end: 7295
            }, {
                begin: 43136,
                end: 43231
            }, {
                begin: 43264,
                end: 43311
            }, {
                begin: 43312,
                end: 43359
            }, {
                begin: 43520,
                end: 43615
            }, {
                begin: 65936,
                end: 65999
            }, {
                begin: 66e3,
                end: 66047
            }, {
                begin: 66208,
                end: 66271
            }, {
                begin: 127024,
                end: 127135
            }];
            r.unicodeRanges = h,
            r.getUnicodeRange = n,
            r.parse = i,
            r.make = o
        }
        , {
            "../parse": 9,
            "../table": 11
        }],
        24: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                var r, n = {}, i = new s.Parser(t,e);
                switch (n.version = i.parseVersion(),
                n.italicAngle = i.parseFixed(),
                n.underlinePosition = i.parseShort(),
                n.underlineThickness = i.parseShort(),
                n.isFixedPitch = i.parseULong(),
                n.minMemType42 = i.parseULong(),
                n.maxMemType42 = i.parseULong(),
                n.minMemType1 = i.parseULong(),
                n.maxMemType1 = i.parseULong(),
                n.version) {
                case 1:
                    n.names = o.standardNames.slice();
                    break;
                case 2:
                    for (n.numberOfGlyphs = i.parseUShort(),
                    n.glyphNameIndex = new Array(n.numberOfGlyphs),
                    r = 0; r < n.numberOfGlyphs; r++)
                        n.glyphNameIndex[r] = i.parseUShort();
                    for (n.names = [],
                    r = 0; r < n.numberOfGlyphs; r++)
                        if (n.glyphNameIndex[r] >= o.standardNames.length) {
                            var a = i.parseChar();
                            n.names.push(i.parseString(a))
                        }
                    break;
                case 2.5:
                    for (n.numberOfGlyphs = i.parseUShort(),
                    n.offset = new Array(n.numberOfGlyphs),
                    r = 0; r < n.numberOfGlyphs; r++)
                        n.offset[r] = i.parseChar()
                }
                return n
            }
            function i() {
                return new a.Table("post",[{
                    name: "version",
                    type: "FIXED",
                    value: 196608
                }, {
                    name: "italicAngle",
                    type: "FIXED",
                    value: 0
                }, {
                    name: "underlinePosition",
                    type: "FWORD",
                    value: 0
                }, {
                    name: "underlineThickness",
                    type: "FWORD",
                    value: 0
                }, {
                    name: "isFixedPitch",
                    type: "ULONG",
                    value: 0
                }, {
                    name: "minMemType42",
                    type: "ULONG",
                    value: 0
                }, {
                    name: "maxMemType42",
                    type: "ULONG",
                    value: 0
                }, {
                    name: "minMemType1",
                    type: "ULONG",
                    value: 0
                }, {
                    name: "maxMemType1",
                    type: "ULONG",
                    value: 0
                }])
            }
            var o = t("../encoding")
              , s = t("../parse")
              , a = t("../table");
            r.parse = n,
            r.make = i
        }
        , {
            "../encoding": 4,
            "../parse": 9,
            "../table": 11
        }],
        25: [function(t, e, r) {
            "use strict";
            function n(t) {
                return Math.log(t) / Math.log(2) | 0
            }
            function i(t) {
                for (; t.length % 4 !== 0; )
                    t.push(0);
                for (var e = 0, r = 0; r < t.length; r += 4)
                    e += (t[r] << 24) + (t[r + 1] << 16) + (t[r + 2] << 8) + t[r + 3];
                return e %= Math.pow(2, 32)
            }
            function o(t, e, r, n) {
                return new p.Table("Table Record",[{
                    name: "tag",
                    type: "TAG",
                    value: void 0 !== t ? t : ""
                }, {
                    name: "checkSum",
                    type: "ULONG",
                    value: void 0 !== e ? e : 0
                }, {
                    name: "offset",
                    type: "ULONG",
                    value: void 0 !== r ? r : 0
                }, {
                    name: "length",
                    type: "ULONG",
                    value: void 0 !== n ? n : 0
                }])
            }
            function s(t) {
                var e = new p.Table("sfnt",[{
                    name: "version",
                    type: "TAG",
                    value: "OTTO"
                }, {
                    name: "numTables",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "searchRange",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "entrySelector",
                    type: "USHORT",
                    value: 0
                }, {
                    name: "rangeShift",
                    type: "USHORT",
                    value: 0
                }]);
                e.tables = t,
                e.numTables = t.length;
                var r = Math.pow(2, n(e.numTables));
                e.searchRange = 16 * r,
                e.entrySelector = n(r),
                e.rangeShift = 16 * e.numTables - e.searchRange;
                for (var s = [], a = [], h = e.sizeOf() + o().sizeOf() * e.numTables; h % 4 !== 0; )
                    h += 1,
                    a.push({
                        name: "padding",
                        type: "BYTE",
                        value: 0
                    });
                for (var u = 0; u < t.length; u += 1) {
                    var c = t[u];
                    l.argument(4 === c.tableName.length, "Table name" + c.tableName + " is invalid.");
                    var d = c.sizeOf()
                      , f = o(c.tableName, i(c.encode()), h, d);
                    for (s.push({
                        name: f.tag + " Table Record",
                        type: "TABLE",
                        value: f
                    }),
                    a.push({
                        name: c.tableName + " table",
                        type: "TABLE",
                        value: c
                    }),
                    h += d,
                    l.argument(!isNaN(h), "Something went wrong calculating the offset."); h % 4 !== 0; )
                        h += 1,
                        a.push({
                            name: "padding",
                            type: "BYTE",
                            value: 0
                        })
                }
                return s.sort(function(t, e) {
                    return t.value.tag > e.value.tag ? 1 : -1
                }),
                e.fields = e.fields.concat(s),
                e.fields = e.fields.concat(a),
                e
            }
            function a(t, e, r) {
                for (var n = 0; n < e.length; n += 1) {
                    var i = t.charToGlyphIndex(e[n]);
                    if (i > 0) {
                        var o = t.glyphs.get(i);
                        return o.getMetrics()
                    }
                }
                return r
            }
            function h(t) {
                for (var e = 0, r = 0; r < t.length; r += 1)
                    e += t[r];
                return e / t.length
            }
            function u(t) {
                for (var e, r = [], n = [], o = [], u = [], l = [], p = [], b = [], T = 0, w = 0, S = 0, M = 0, A = 0, C = 0; C < t.glyphs.length; C += 1) {
                    var R = t.glyphs.get(C)
                      , E = 0 | R.unicode;
                    (e > E || null === e) && (e = E),
                    E > T && (T = E);
                    var P = _.getUnicodeRange(E);
                    if (32 > P)
                        w |= 1 << P;
                    else if (64 > P)
                        S |= 1 << P - 32;
                    else if (96 > P)
                        M |= 1 << P - 64;
                    else {
                        if (!(123 > P))
                            throw new Error("Unicode ranges bits > 123 are reserved for internal usage");
                        A |= 1 << P - 96
                    }
                    if (".notdef" !== R.name) {
                        var N = R.getMetrics();
                        r.push(N.xMin),
                        n.push(N.yMin),
                        o.push(N.xMax),
                        u.push(N.yMax),
                        p.push(N.leftSideBearing),
                        b.push(N.rightSideBearing),
                        l.push(R.advanceWidth)
                    }
                }
                var O = {
                    xMin: Math.min.apply(null, r),
                    yMin: Math.min.apply(null, n),
                    xMax: Math.max.apply(null, o),
                    yMax: Math.max.apply(null, u),
                    advanceWidthMax: Math.max.apply(null, l),
                    advanceWidthAvg: h(l),
                    minLeftSideBearing: Math.min.apply(null, p),
                    maxLeftSideBearing: Math.max.apply(null, p),
                    minRightSideBearing: Math.min.apply(null, b)
                };
                O.ascender = void 0 !== t.ascender ? t.ascender : O.yMax,
                O.descender = void 0 !== t.descender ? t.descender : O.yMin;
                var k = f.make({
                    unitsPerEm: t.unitsPerEm,
                    xMin: O.xMin,
                    yMin: O.yMin,
                    xMax: O.xMax,
                    yMax: O.yMax
                })
                  , I = m.make({
                    ascender: O.ascender,
                    descender: O.descender,
                    advanceWidthMax: O.advanceWidthMax,
                    minLeftSideBearing: O.minLeftSideBearing,
                    minRightSideBearing: O.minRightSideBearing,
                    xMaxExtent: O.maxLeftSideBearing + (O.xMax - O.xMin),
                    numberOfHMetrics: t.glyphs.length
                })
                  , L = g.make(t.glyphs.length)
                  , D = _.make({
                    xAvgCharWidth: Math.round(O.advanceWidthAvg),
                    usWeightClass: 500,
                    usWidthClass: 5,
                    usFirstCharIndex: e,
                    usLastCharIndex: T,
                    ulUnicodeRange1: w,
                    ulUnicodeRange2: S,
                    ulUnicodeRange3: M,
                    ulUnicodeRange4: A,
                    sTypoAscender: O.ascender,
                    sTypoDescender: O.descender,
                    sTypoLineGap: 0,
                    usWinAscent: O.ascender,
                    usWinDescent: -O.descender,
                    sxHeight: a(t, "xyvw", {
                        yMax: 0
                    }).yMax,
                    sCapHeight: a(t, "HIKLEFJMNTZBDPRAGOQSUVWXY", O).yMax,
                    usBreakChar: t.hasChar(" ") ? 32 : 0
                })
                  , F = y.make(t.glyphs)
                  , U = c.make(t.glyphs)
                  , B = t.familyName + " " + t.styleName
                  , G = t.familyName.replace(/\s/g, "") + "-" + t.styleName
                  , V = v.make({
                    copyright: t.copyright,
                    fontFamily: t.familyName,
                    fontSubfamily: t.styleName,
                    uniqueID: t.manufacturer + ":" + B,
                    fullName: B,
                    version: t.version,
                    postScriptName: G,
                    trademark: t.trademark,
                    manufacturer: t.manufacturer,
                    designer: t.designer,
                    description: t.description,
                    manufacturerURL: t.manufacturerURL,
                    designerURL: t.designerURL,
                    license: t.license,
                    licenseURL: t.licenseURL,
                    preferredFamily: t.familyName,
                    preferredSubfamily: t.styleName
                })
                  , q = x.make()
                  , H = d.make(t.glyphs, {
                    version: t.version,
                    fullName: B,
                    familyName: t.familyName,
                    weightName: t.styleName,
                    postScriptName: G,
                    unitsPerEm: t.unitsPerEm
                })
                  , j = [k, I, L, D, V, U, q, H, F]
                  , z = s(j)
                  , X = z.encode()
                  , W = i(X)
                  , Y = z.fields
                  , Z = !1;
                for (C = 0; C < Y.length; C += 1)
                    if ("head table" === Y[C].name) {
                        Y[C].value.checkSumAdjustment = 2981146554 - W,
                        Z = !0;
                        break
                    }
                if (!Z)
                    throw new Error("Could not find head table with checkSum to adjust.");
                return z
            }
            var l = t("../check")
              , p = t("../table")
              , c = t("./cmap")
              , d = t("./cff")
              , f = t("./head")
              , m = t("./hhea")
              , y = t("./hmtx")
              , g = t("./maxp")
              , v = t("./name")
              , _ = t("./os2")
              , x = t("./post");
            r.computeCheckSum = i,
            r.make = s,
            r.fontToTable = u
        }
        , {
            "../check": 2,
            "../table": 11,
            "./cff": 12,
            "./cmap": 13,
            "./head": 16,
            "./hhea": 17,
            "./hmtx": 18,
            "./maxp": 21,
            "./name": 22,
            "./os2": 23,
            "./post": 24
        }],
        26: [function(t, e, r) {
            "use strict";
            function n(t) {
                return function() {
                    return t
                }
            }
            var i = t("./check")
              , o = 32768
              , s = 2147483648
              , a = {}
              , h = {}
              , u = {};
            h.BYTE = function(t) {
                return i.argument(t >= 0 && 255 >= t, "Byte value should be between 0 and 255."),
                [t]
            }
            ,
            u.BYTE = n(1),
            h.CHAR = function(t) {
                return [t.charCodeAt(0)]
            }
            ,
            u.BYTE = n(1),
            h.CHARARRAY = function(t) {
                for (var e = [], r = 0; r < t.length; r += 1)
                    e.push(t.charCodeAt(r));
                return e
            }
            ,
            u.CHARARRAY = function(t) {
                return t.length
            }
            ,
            h.USHORT = function(t) {
                return [t >> 8 & 255, 255 & t]
            }
            ,
            u.USHORT = n(2),
            h.SHORT = function(t) {
                return t >= o && (t = -(2 * o - t)),
                [t >> 8 & 255, 255 & t]
            }
            ,
            u.SHORT = n(2),
            h.UINT24 = function(t) {
                return [t >> 16 & 255, t >> 8 & 255, 255 & t]
            }
            ,
            u.UINT24 = n(3),
            h.ULONG = function(t) {
                return [t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, 255 & t]
            }
            ,
            u.ULONG = n(4),
            h.LONG = function(t) {
                return t >= s && (t = -(2 * s - t)),
                [t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, 255 & t]
            }
            ,
            u.LONG = n(4),
            h.FIXED = h.ULONG,
            u.FIXED = u.ULONG,
            h.FWORD = h.SHORT,
            u.FWORD = u.SHORT,
            h.UFWORD = h.USHORT,
            u.UFWORD = u.USHORT,
            h.LONGDATETIME = function() {
                return [0, 0, 0, 0, 0, 0, 0, 0]
            }
            ,
            u.LONGDATETIME = n(8),
            h.TAG = function(t) {
                return i.argument(4 === t.length, "Tag should be exactly 4 ASCII characters."),
                [t.charCodeAt(0), t.charCodeAt(1), t.charCodeAt(2), t.charCodeAt(3)]
            }
            ,
            u.TAG = n(4),
            h.Card8 = h.BYTE,
            u.Card8 = u.BYTE,
            h.Card16 = h.USHORT,
            u.Card16 = u.USHORT,
            h.OffSize = h.BYTE,
            u.OffSize = u.BYTE,
            h.SID = h.USHORT,
            u.SID = u.USHORT,
            h.NUMBER = function(t) {
                return t >= -107 && 107 >= t ? [t + 139] : t >= 108 && 1131 >= t ? (t -= 108,
                [(t >> 8) + 247, 255 & t]) : t >= -1131 && -108 >= t ? (t = -t - 108,
                [(t >> 8) + 251, 255 & t]) : t >= -32768 && 32767 >= t ? h.NUMBER16(t) : h.NUMBER32(t)
            }
            ,
            u.NUMBER = function(t) {
                return h.NUMBER(t).length
            }
            ,
            h.NUMBER16 = function(t) {
                return [28, t >> 8 & 255, 255 & t]
            }
            ,
            u.NUMBER16 = n(2),
            h.NUMBER32 = function(t) {
                return [29, t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, 255 & t]
            }
            ,
            u.NUMBER32 = n(4),
            h.REAL = function(t) {
                var e = t.toString()
                  , r = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(e);
                if (r) {
                    var n = parseFloat("1e" + ((r[2] ? +r[2] : 0) + r[1].length));
                    e = (Math.round(t * n) / n).toString()
                }
                var i, o, s = "";
                for (i = 0,
                o = e.length; o > i; i += 1) {
                    var a = e[i];
                    s += "e" === a ? "-" === e[++i] ? "c" : "b" : "." === a ? "a" : "-" === a ? "e" : a
                }
                s += 1 & s.length ? "f" : "ff";
                var h = [30];
                for (i = 0,
                o = s.length; o > i; i += 2)
                    h.push(parseInt(s.substr(i, 2), 16));
                return h
            }
            ,
            u.REAL = function(t) {
                return h.REAL(t).length
            }
            ,
            h.NAME = h.CHARARRAY,
            u.NAME = u.CHARARRAY,
            h.STRING = h.CHARARRAY,
            u.STRING = u.CHARARRAY,
            h.UTF16 = function(t) {
                for (var e = [], r = 0; r < t.length; r += 1)
                    e.push(0),
                    e.push(t.charCodeAt(r));
                return e
            }
            ,
            u.UTF16 = function(t) {
                return 2 * t.length
            }
            ,
            h.INDEX = function(t) {
                var e, r = 1, n = [r], i = [], o = 0;
                for (e = 0; e < t.length; e += 1) {
                    var s = h.OBJECT(t[e]);
                    Array.prototype.push.apply(i, s),
                    o += s.length,
                    r += s.length,
                    n.push(r)
                }
                if (0 === i.length)
                    return [0, 0];
                var a = []
                  , u = 1 + Math.floor(Math.log(o) / Math.log(2)) / 8 | 0
                  , l = [void 0, h.BYTE, h.USHORT, h.UINT24, h.ULONG][u];
                for (e = 0; e < n.length; e += 1) {
                    var p = l(n[e]);
                    Array.prototype.push.apply(a, p)
                }
                return Array.prototype.concat(h.Card16(t.length), h.OffSize(u), a, i)
            }
            ,
            u.INDEX = function(t) {
                return h.INDEX(t).length
            }
            ,
            h.DICT = function(t) {
                for (var e = [], r = Object.keys(t), n = r.length, i = 0; n > i; i += 1) {
                    var o = parseInt(r[i], 0)
                      , s = t[o];
                    e = e.concat(h.OPERAND(s.value, s.type)),
                    e = e.concat(h.OPERATOR(o))
                }
                return e
            }
            ,
            u.DICT = function(t) {
                return h.DICT(t).length
            }
            ,
            h.OPERATOR = function(t) {
                return 1200 > t ? [t] : [12, t - 1200]
            }
            ,
            h.OPERAND = function(t, e) {
                var r = [];
                if (Array.isArray(e))
                    for (var n = 0; n < e.length; n += 1)
                        i.argument(t.length === e.length, "Not enough arguments given for type" + e),
                        r = r.concat(h.OPERAND(t[n], e[n]));
                else if ("SID" === e)
                    r = r.concat(h.NUMBER(t));
                else if ("offset" === e)
                    r = r.concat(h.NUMBER32(t));
                else if ("number" === e)
                    r = r.concat(h.NUMBER(t));
                else {
                    if ("real" !== e)
                        throw new Error("Unknown operand type " + e);
                    r = r.concat(h.REAL(t))
                }
                return r
            }
            ,
            h.OP = h.BYTE,
            u.OP = u.BYTE;
            var l = "function" == typeof WeakMap && new WeakMap;
            h.CHARSTRING = function(t) {
                if (l && l.has(t))
                    return l.get(t);
                for (var e = [], r = t.length, n = 0; r > n; n += 1) {
                    var i = t[n];
                    e = e.concat(h[i.type](i.value))
                }
                return l && l.set(t, e),
                e
            }
            ,
            u.CHARSTRING = function(t) {
                return h.CHARSTRING(t).length
            }
            ,
            h.OBJECT = function(t) {
                var e = h[t.type];
                return i.argument(void 0 !== e, "No encoding function for type " + t.type),
                e(t.value)
            }
            ,
            h.TABLE = function(t) {
                for (var e = [], r = t.fields.length, n = 0; r > n; n += 1) {
                    var o = t.fields[n]
                      , s = h[o.type];
                    i.argument(void 0 !== s, "No encoding function for field type " + o.type);
                    var a = t[o.name];
                    void 0 === a && (a = o.value);
                    var u = s(a);
                    e = e.concat(u)
                }
                return e
            }
            ,
            h.LITERAL = function(t) {
                return t
            }
            ,
            u.LITERAL = function(t) {
                return t.length
            }
            ,
            r.decode = a,
            r.encode = h,
            r.sizeOf = u
        }
        , {
            "./check": 2
        }],
        27: [function(_dereq_, module, exports) {
            !function(t, e, r) {
                "undefined" != typeof module && module.exports ? module.exports = r() : "function" == typeof define && define.amd ? define(r) : e[t] = r()
            }("reqwest", this, function() {
                function succeed(t) {
                    var e = protocolRe.exec(t.url);
                    return e = e && e[1] || window.location.protocol,
                    httpsRe.test(e) ? twoHundo.test(t.request.status) : !!t.request.response
                }
                function handleReadyState(t, e, r) {
                    return function() {
                        return t._aborted ? r(t.request) : t._timedOut ? r(t.request, "Request is aborted: timeout") : void (t.request && 4 == t.request[readyState] && (t.request.onreadystatechange = noop,
                        succeed(t) ? e(t.request) : r(t.request)))
                    }
                }
                function setHeaders(t, e) {
                    var r, n = e.headers || {};
                    n.Accept = n.Accept || defaultHeaders.accept[e.type] || defaultHeaders.accept["*"];
                    var i = "function" == typeof FormData && e.data instanceof FormData;
                    e.crossOrigin || n[requestedWith] || (n[requestedWith] = defaultHeaders.requestedWith),
                    n[contentType] || i || (n[contentType] = e.contentType || defaultHeaders.contentType);
                    for (r in n)
                        n.hasOwnProperty(r) && "setRequestHeader"in t && t.setRequestHeader(r, n[r])
                }
                function setCredentials(t, e) {
                    "undefined" != typeof e.withCredentials && "undefined" != typeof t.withCredentials && (t.withCredentials = !!e.withCredentials)
                }
                function generalCallback(t) {
                    lastValue = t
                }
                function urlappend(t, e) {
                    return t + (/\?/.test(t) ? "&" : "?") + e
                }
                function handleJsonp(t, e, r, n) {
                    var i = uniqid++
                      , o = t.jsonpCallback || "callback"
                      , s = t.jsonpCallbackName || reqwest.getcallbackPrefix(i)
                      , a = new RegExp("((^|\\?|&)" + o + ")=([^&]+)")
                      , h = n.match(a)
                      , u = doc.createElement("script")
                      , l = 0
                      , p = -1 !== navigator.userAgent.indexOf("MSIE 10.0");
                    return h ? "?" === h[3] ? n = n.replace(a, "$1=" + s) : s = h[3] : n = urlappend(n, o + "=" + s),
                    win[s] = generalCallback,
                    u.type = "text/javascript",
                    u.src = n,
                    u.async = !0,
                    "undefined" == typeof u.onreadystatechange || p || (u.htmlFor = u.id = "_reqwest_" + i),
                    u.onload = u.onreadystatechange = function() {
                        return u[readyState] && "complete" !== u[readyState] && "loaded" !== u[readyState] || l ? !1 : (u.onload = u.onreadystatechange = null,
                        u.onclick && u.onclick(),
                        e(lastValue),
                        lastValue = void 0,
                        head.removeChild(u),
                        void (l = 1))
                    }
                    ,
                    head.appendChild(u),
                    {
                        abort: function() {
                            u.onload = u.onreadystatechange = null,
                            r({}, "Request is aborted: timeout", {}),
                            lastValue = void 0,
                            head.removeChild(u),
                            l = 1
                        }
                    }
                }
                function getRequest(t, e) {
                    var r, n = this.o, i = (n.method || "GET").toUpperCase(), o = "string" == typeof n ? n : n.url, s = n.processData !== !1 && n.data && "string" != typeof n.data ? reqwest.toQueryString(n.data) : n.data || null, a = !1;
                    return "jsonp" != n.type && "GET" != i || !s || (o = urlappend(o, s),
                    s = null),
                    "jsonp" == n.type ? handleJsonp(n, t, e, o) : (r = n.xhr && n.xhr(n) || xhr(n),
                    r.open(i, o, n.async !== !1),
                    setHeaders(r, n),
                    setCredentials(r, n),
                    win[xDomainRequest] && r instanceof win[xDomainRequest] ? (r.onload = t,
                    r.onerror = e,
                    r.onprogress = function() {}
                    ,
                    a = !0) : r.onreadystatechange = handleReadyState(this, t, e),
                    n.before && n.before(r),
                    a ? setTimeout(function() {
                        r.send(s)
                    }, 200) : r.send(s),
                    r)
                }
                function Reqwest(t, e) {
                    this.o = t,
                    this.fn = e,
                    init.apply(this, arguments)
                }
                function setType(t) {
                    return t.match("json") ? "json" : t.match("javascript") ? "js" : t.match("text") ? "html" : t.match("xml") ? "xml" : void 0
                }
                function init(o, fn) {
                    function complete(t) {
                        for (o.timeout && clearTimeout(self.timeout),
                        self.timeout = null; self._completeHandlers.length > 0; )
                            self._completeHandlers.shift()(t)
                    }
                    function success(resp) {
                        var type = o.type || resp && setType(resp.getResponseHeader("Content-Type"));
                        resp = "jsonp" !== type ? self.request : resp;
                        var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
                          , r = filteredResponse;
                        try {
                            resp.responseText = r
                        } catch (e) {}
                        if (r)
                            switch (type) {
                            case "json":
                                try {
                                    resp = win.JSON ? win.JSON.parse(r) : eval("(" + r + ")")
                                } catch (err) {
                                    return error(resp, "Could not parse JSON in response", err)
                                }
                                break;
                            case "js":
                                resp = eval(r);
                                break;
                            case "html":
                                resp = r;
                                break;
                            case "xml":
                                resp = resp.responseXML && resp.responseXML.parseError && resp.responseXML.parseError.errorCode && resp.responseXML.parseError.reason ? null : resp.responseXML
                            }
                        for (self._responseArgs.resp = resp,
                        self._fulfilled = !0,
                        fn(resp),
                        self._successHandler(resp); self._fulfillmentHandlers.length > 0; )
                            resp = self._fulfillmentHandlers.shift()(resp);
                        complete(resp)
                    }
                    function timedOut() {
                        self._timedOut = !0,
                        self.request.abort()
                    }
                    function error(t, e, r) {
                        for (t = self.request,
                        self._responseArgs.resp = t,
                        self._responseArgs.msg = e,
                        self._responseArgs.t = r,
                        self._erred = !0; self._errorHandlers.length > 0; )
                            self._errorHandlers.shift()(t, e, r);
                        complete(t)
                    }
                    this.url = "string" == typeof o ? o : o.url,
                    this.timeout = null,
                    this._fulfilled = !1,
                    this._successHandler = function() {}
                    ,
                    this._fulfillmentHandlers = [],
                    this._errorHandlers = [],
                    this._completeHandlers = [],
                    this._erred = !1,
                    this._responseArgs = {};
                    var self = this;
                    fn = fn || function() {}
                    ,
                    o.timeout && (this.timeout = setTimeout(function() {
                        timedOut()
                    }, o.timeout)),
                    o.success && (this._successHandler = function() {
                        o.success.apply(o, arguments)
                    }
                    ),
                    o.error && this._errorHandlers.push(function() {
                        o.error.apply(o, arguments)
                    }),
                    o.complete && this._completeHandlers.push(function() {
                        o.complete.apply(o, arguments)
                    }),
                    this.request = getRequest.call(this, success, error)
                }
                function reqwest(t, e) {
                    return new Reqwest(t,e)
                }
                function normalize(t) {
                    return t ? t.replace(/\r?\n/g, "\r\n") : ""
                }
                function serial(t, e) {
                    var r, n, i, o, s = t.name, a = t.tagName.toLowerCase(), h = function(t) {
                        t && !t.disabled && e(s, normalize(t.attributes.value && t.attributes.value.specified ? t.value : t.text))
                    };
                    if (!t.disabled && s)
                        switch (a) {
                        case "input":
                            /reset|button|image|file/i.test(t.type) || (r = /checkbox/i.test(t.type),
                            n = /radio/i.test(t.type),
                            i = t.value,
                            (!(r || n) || t.checked) && e(s, normalize(r && "" === i ? "on" : i)));
                            break;
                        case "textarea":
                            e(s, normalize(t.value));
                            break;
                        case "select":
                            if ("select-one" === t.type.toLowerCase())
                                h(t.selectedIndex >= 0 ? t.options[t.selectedIndex] : null);
                            else
                                for (o = 0; t.length && o < t.length; o++)
                                    t.options[o].selected && h(t.options[o])
                        }
                }
                function eachFormElement() {
                    var t, e, r = this, n = function(t, e) {
                        var n, i, o;
                        for (n = 0; n < e.length; n++)
                            for (o = t[byTag](e[n]),
                            i = 0; i < o.length; i++)
                                serial(o[i], r)
                    };
                    for (e = 0; e < arguments.length; e++)
                        t = arguments[e],
                        /input|select|textarea/i.test(t.tagName) && serial(t, r),
                        n(t, ["input", "select", "textarea"])
                }
                function serializeQueryString() {
                    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
                }
                function serializeHash() {
                    var t = {};
                    return eachFormElement.apply(function(e, r) {
                        e in t ? (t[e] && !isArray(t[e]) && (t[e] = [t[e]]),
                        t[e].push(r)) : t[e] = r
                    }, arguments),
                    t
                }
                function buildParams(t, e, r, n) {
                    var i, o, s, a = /\[\]$/;
                    if (isArray(e))
                        for (o = 0; e && o < e.length; o++)
                            s = e[o],
                            r || a.test(t) ? n(t, s) : buildParams(t + "[" + ("object" == typeof s ? o : "") + "]", s, r, n);
                    else if (e && "[object Object]" === e.toString())
                        for (i in e)
                            buildParams(t + "[" + i + "]", e[i], r, n);
                    else
                        n(t, e)
                }
                var win = window, doc = document, httpsRe = /^http/, protocolRe = /(^\w+):\/\//, twoHundo = /^(20\d|1223)$/, byTag = "getElementsByTagName", readyState = "readyState", contentType = "Content-Type", requestedWith = "X-Requested-With", head = doc[byTag]("head")[0], uniqid = 0, callbackPrefix = "reqwest_" + +new Date, lastValue, xmlHttpRequest = "XMLHttpRequest", xDomainRequest = "XDomainRequest", noop = function() {}, isArray = "function" == typeof Array.isArray ? Array.isArray : function(t) {
                    return t instanceof Array
                }
                , defaultHeaders = {
                    contentType: "application/x-www-form-urlencoded",
                    requestedWith: xmlHttpRequest,
                    accept: {
                        "*": "text/javascript, text/html, application/xml, text/xml, */*",
                        xml: "application/xml, text/xml",
                        html: "text/html",
                        text: "text/plain",
                        json: "application/json, text/javascript",
                        js: "application/javascript, text/javascript"
                    }
                }, xhr = function(t) {
                    if (t.crossOrigin === !0) {
                        var e = win[xmlHttpRequest] ? new XMLHttpRequest : null;
                        if (e && "withCredentials"in e)
                            return e;
                        if (win[xDomainRequest])
                            return new XDomainRequest;
                        throw new Error("Browser does not support cross-origin requests")
                    }
                    return win[xmlHttpRequest] ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")
                }, globalSetupOptions = {
                    dataFilter: function(t) {
                        return t
                    }
                };
                return Reqwest.prototype = {
                    abort: function() {
                        this._aborted = !0,
                        this.request.abort()
                    },
                    retry: function() {
                        init.call(this, this.o, this.fn)
                    },
                    then: function(t, e) {
                        return t = t || function() {}
                        ,
                        e = e || function() {}
                        ,
                        this._fulfilled ? this._responseArgs.resp = t(this._responseArgs.resp) : this._erred ? e(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t) : (this._fulfillmentHandlers.push(t),
                        this._errorHandlers.push(e)),
                        this
                    },
                    always: function(t) {
                        return this._fulfilled || this._erred ? t(this._responseArgs.resp) : this._completeHandlers.push(t),
                        this
                    },
                    fail: function(t) {
                        return this._erred ? t(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t) : this._errorHandlers.push(t),
                        this
                    },
                    "catch": function(t) {
                        return this.fail(t)
                    }
                },
                reqwest.serializeArray = function() {
                    var t = [];
                    return eachFormElement.apply(function(e, r) {
                        t.push({
                            name: e,
                            value: r
                        })
                    }, arguments),
                    t
                }
                ,
                reqwest.serialize = function() {
                    if (0 === arguments.length)
                        return "";
                    var t, e, r = Array.prototype.slice.call(arguments, 0);
                    return t = r.pop(),
                    t && t.nodeType && r.push(t) && (t = null),
                    t && (t = t.type),
                    e = "map" == t ? serializeHash : "array" == t ? reqwest.serializeArray : serializeQueryString,
                    e.apply(null, r)
                }
                ,
                reqwest.toQueryString = function(t, e) {
                    var r, n, i = e || !1, o = [], s = encodeURIComponent, a = function(t, e) {
                        e = "function" == typeof e ? e() : null == e ? "" : e,
                        o[o.length] = s(t) + "=" + s(e)
                    };
                    if (isArray(t))
                        for (n = 0; t && n < t.length; n++)
                            a(t[n].name, t[n].value);
                    else
                        for (r in t)
                            t.hasOwnProperty(r) && buildParams(r, t[r], i, a);
                    return o.join("&").replace(/%20/g, "+")
                }
                ,
                reqwest.getcallbackPrefix = function() {
                    return callbackPrefix
                }
                ,
                reqwest.compat = function(t, e) {
                    return t && (t.type && (t.method = t.type) && delete t.type,
                    t.dataType && (t.type = t.dataType),
                    t.jsonpCallback && (t.jsonpCallbackName = t.jsonpCallback) && delete t.jsonpCallback,
                    t.jsonp && (t.jsonpCallback = t.jsonp)),
                    new Reqwest(t,e)
                }
                ,
                reqwest.ajaxSetup = function(t) {
                    t = t || {};
                    for (var e in t)
                        globalSetupOptions[e] = t[e]
                }
                ,
                reqwest
            })
        }
        , {}],
        28: [function(t, e, r) {
            "use strict";
            var n = t("./core/core");
            t("./color/p5.Color"),
            t("./core/p5.Element"),
            t("./typography/p5.Font"),
            t("./core/p5.Graphics"),
            t("./core/p5.Renderer2D"),
            t("./image/p5.Image"),
            t("./math/p5.Vector"),
            t("./io/p5.TableRow"),
            t("./io/p5.Table"),
            t("./io/p5.XML"),
            t("./color/creating_reading"),
            t("./color/setting"),
            t("./core/constants"),
            t("./utilities/conversion"),
            t("./utilities/array_functions"),
            t("./utilities/string_functions"),
            t("./core/environment"),
            t("./image/image"),
            t("./image/loading_displaying"),
            t("./image/pixels"),
            t("./io/files"),
            t("./events/keyboard"),
            t("./events/acceleration"),
            t("./events/mouse"),
            t("./utilities/time_date"),
            t("./events/touch"),
            t("./math/math"),
            t("./math/calculation"),
            t("./math/random"),
            t("./math/noise"),
            t("./math/trigonometry"),
            t("./core/rendering"),
            t("./core/2d_primitives"),
            t("./core/attributes"),
            t("./core/curves"),
            t("./core/vertex"),
            t("./core/structure"),
            t("./core/transform"),
            t("./typography/attributes"),
            t("./typography/loading_displaying"),
            t("./webgl/p5.RendererGL"),
            t("./webgl/p5.Geometry"),
            t("./webgl/p5.RendererGL.Retained"),
            t("./webgl/p5.RendererGL.Immediate"),
            t("./webgl/primitives"),
            t("./webgl/loading"),
            t("./webgl/p5.Matrix"),
            t("./webgl/material"),
            t("./webgl/light"),
            t("./webgl/shader"),
            t("./webgl/camera"),
            t("./webgl/interaction");
            var i = function() {
                window.PHANTOMJS || window.mocha || (window.setup && "function" == typeof window.setup || window.draw && "function" == typeof window.draw) && new n
            };
            "complete" === document.readyState ? i() : window.addEventListener("load", i, !1),
            e.exports = n
        }
        , {
            "./color/creating_reading": 30,
            "./color/p5.Color": 31,
            "./color/setting": 32,
            "./core/2d_primitives": 33,
            "./core/attributes": 34,
            "./core/constants": 36,
            "./core/core": 37,
            "./core/curves": 38,
            "./core/environment": 39,
            "./core/p5.Element": 41,
            "./core/p5.Graphics": 42,
            "./core/p5.Renderer2D": 44,
            "./core/rendering": 45,
            "./core/structure": 47,
            "./core/transform": 48,
            "./core/vertex": 49,
            "./events/acceleration": 50,
            "./events/keyboard": 51,
            "./events/mouse": 52,
            "./events/touch": 53,
            "./image/image": 55,
            "./image/loading_displaying": 56,
            "./image/p5.Image": 57,
            "./image/pixels": 58,
            "./io/files": 59,
            "./io/p5.Table": 60,
            "./io/p5.TableRow": 61,
            "./io/p5.XML": 62,
            "./math/calculation": 63,
            "./math/math": 64,
            "./math/noise": 65,
            "./math/p5.Vector": 66,
            "./math/random": 68,
            "./math/trigonometry": 69,
            "./typography/attributes": 70,
            "./typography/loading_displaying": 71,
            "./typography/p5.Font": 72,
            "./utilities/array_functions": 73,
            "./utilities/conversion": 74,
            "./utilities/string_functions": 75,
            "./utilities/time_date": 76,
            "./webgl/camera": 77,
            "./webgl/interaction": 78,
            "./webgl/light": 79,
            "./webgl/loading": 80,
            "./webgl/material": 81,
            "./webgl/p5.Geometry": 82,
            "./webgl/p5.Matrix": 83,
            "./webgl/p5.RendererGL": 86,
            "./webgl/p5.RendererGL.Immediate": 84,
            "./webgl/p5.RendererGL.Retained": 85,
            "./webgl/primitives": 87,
            "./webgl/shader": 88
        }],
        29: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.ColorConversion = {},
            n.ColorConversion._hsbaToHSLA = function(t) {
                var e = t[0]
                  , r = t[1]
                  , n = t[2]
                  , i = (2 - r) * n / 2;
                return 0 !== i && (1 === i ? r = 0 : .5 > i ? r /= 2 - r : r = r * n / (2 - 2 * i)),
                [e, r, i, t[3]]
            }
            ,
            n.ColorConversion._hsbaToRGBA = function(t) {
                var e = 6 * t[0]
                  , r = t[1]
                  , n = t[2]
                  , i = [];
                if (0 === r)
                    i = [n, n, n, t[3]];
                else {
                    var o, s, a, h = Math.floor(e), u = n * (1 - r), l = n * (1 - r * (e - h)), p = n * (1 - r * (1 + h - e));
                    0 === h ? (o = n,
                    s = p,
                    a = u) : 1 === h ? (o = l,
                    s = n,
                    a = u) : 2 === h ? (o = u,
                    s = n,
                    a = p) : 3 === h ? (o = u,
                    s = l,
                    a = n) : 4 === h ? (o = p,
                    s = u,
                    a = n) : (o = n,
                    s = u,
                    a = l),
                    i = [o, s, a, t[3]]
                }
                return i
            }
            ,
            n.ColorConversion._hslaToHSBA = function(t) {
                var e, r = t[0], n = t[1], i = t[2];
                return e = .5 > i ? (1 + n) * i : i + n - i * n,
                n = 2 * (e - i) / e,
                [r, n, e, t[3]]
            }
            ,
            n.ColorConversion._hslaToRGBA = function(t) {
                var e = 6 * t[0]
                  , r = t[1]
                  , n = t[2]
                  , i = [];
                if (0 === r)
                    i = [n, n, n, t[3]];
                else {
                    var o;
                    o = .5 > n ? (1 + r) * n : n + r - n * r;
                    var s = 2 * n - o
                      , a = function(t, e, r) {
                        return 0 > t ? t += 6 : t >= 6 && (t -= 6),
                        1 > t ? e + (r - e) * t : 3 > t ? r : 4 > t ? e + (r - e) * (4 - t) : e
                    };
                    i = [a(e + 2, s, o), a(e, s, o), a(e - 2, s, o), t[3]]
                }
                return i
            }
            ,
            n.ColorConversion._rgbaToHSBA = function(t) {
                var e, r, n = t[0], i = t[1], o = t[2], s = Math.max(n, i, o), a = s - Math.min(n, i, o);
                return 0 === a ? (e = 0,
                r = 0) : (r = a / s,
                n === s ? e = (i - o) / a : i === s ? e = 2 + (o - n) / a : o === s && (e = 4 + (n - i) / a),
                0 > e ? e += 6 : e >= 6 && (e -= 6)),
                [e / 6, r, s, t[3]]
            }
            ,
            n.ColorConversion._rgbaToHSLA = function(t) {
                var e, r, n = t[0], i = t[1], o = t[2], s = Math.max(n, i, o), a = Math.min(n, i, o), h = s + a, u = s - a;
                return 0 === u ? (e = 0,
                r = 0) : (r = 1 > h ? u / h : u / (2 - u),
                n === s ? e = (i - o) / u : i === s ? e = 2 + (o - n) / u : o === s && (e = 4 + (n - i) / u),
                0 > e ? e += 6 : e >= 6 && (e -= 6)),
                [e / 6, r, h / 2, t[3]]
            }
            ,
            e.exports = n.ColorConversion
        }
        , {
            "../core/core": 37
        }],
        30: [function(t, e, r) {
            "use strict";
            var n = t("../core/core")
              , i = t("../core/constants");
            t("./p5.Color"),
            n.prototype.alpha = function(t) {
                if (t instanceof n.Color || t instanceof Array)
                    return this.color(t)._getAlpha();
                throw new Error("Needs p5.Color or pixel array as argument.")
            }
            ,
            n.prototype.blue = function(t) {
                if (t instanceof n.Color || t instanceof Array)
                    return this.color(t)._getBlue();
                throw new Error("Needs p5.Color or pixel array as argument.")
            }
            ,
            n.prototype.brightness = function(t) {
                if (t instanceof n.Color || t instanceof Array)
                    return this.color(t)._getBrightness();
                throw new Error("Needs p5.Color or pixel array as argument.")
            }
            ,
            n.prototype.color = function() {
                return arguments[0]instanceof n.Color ? arguments[0] : arguments[0]instanceof Array ? this instanceof n.Renderer ? new n.Color(this,arguments[0]) : new n.Color(this._renderer,arguments[0]) : this instanceof n.Renderer ? new n.Color(this,arguments) : new n.Color(this._renderer,arguments)
            }
            ,
            n.prototype.green = function(t) {
                if (t instanceof n.Color || t instanceof Array)
                    return this.color(t)._getGreen();
                throw new Error("Needs p5.Color or pixel array as argument.")
            }
            ,
            n.prototype.hue = function(t) {
                if (t instanceof n.Color || t instanceof Array)
                    return this.color(t)._getHue();
                throw new Error("Needs p5.Color or pixel array as argument.")
            }
            ,
            n.prototype.lerpColor = function(t, e, r) {
                var n, o, s, a, h, u, l = this._renderer._colorMode, p = this._renderer._colorMaxes;
                if (l === i.RGB)
                    h = t.levels.map(function(t) {
                        return t / 255
                    }),
                    u = e.levels.map(function(t) {
                        return t / 255
                    });
                else if (l === i.HSB)
                    t._getBrightness(),
                    e._getBrightness(),
                    h = t.hsba,
                    u = e.hsba;
                else {
                    if (l !== i.HSL)
                        throw new Error(l + "cannot be used for interpolation.");
                    t._getLightness(),
                    e._getLightness(),
                    h = t.hsla,
                    u = e.hsla
                }
                return r = Math.max(Math.min(r, 1), 0),
                n = this.lerp(h[0], u[0], r),
                o = this.lerp(h[1], u[1], r),
                s = this.lerp(h[2], u[2], r),
                a = this.lerp(h[3], u[3], r),
                n *= p[l][0],
                o *= p[l][1],
                s *= p[l][2],
                a *= p[l][3],
                this.color(n, o, s, a)
            }
            ,
            n.prototype.lightness = function(t) {
                if (t instanceof n.Color || t instanceof Array)
                    return this.color(t)._getLightness();
                throw new Error("Needs p5.Color or pixel array as argument.")
            }
            ,
            n.prototype.red = function(t) {
                if (t instanceof n.Color || t instanceof Array)
                    return this.color(t)._getRed();
                throw new Error("Needs p5.Color or pixel array as argument.")
            }
            ,
            n.prototype.saturation = function(t) {
                if (t instanceof n.Color || t instanceof Array)
                    return this.color(t)._getSaturation();
                throw new Error("Needs p5.Color or pixel array as argument.")
            }
            ,
            e.exports = n
        }
        , {
            "../core/constants": 36,
            "../core/core": 37,
            "./p5.Color": 31
        }],
        31: [function(t, e, r) {
            var n = t("../core/core")
              , i = t("../core/constants")
              , o = t("./color_conversion");
            n.Color = function(t, e) {
                if (this.mode = t._colorMode,
                this.maxes = t._colorMaxes,
                this.mode !== i.RGB && this.mode !== i.HSL && this.mode !== i.HSB)
                    throw new Error(this.mode + " is an invalid colorMode.");
                return this._array = n.Color._parseInputs.apply(t, e),
                this.levels = this._array.map(function(t) {
                    return Math.round(255 * t)
                }),
                this
            }
            ,
            n.Color.prototype.toString = function() {
                var t = this.levels;
                return t[3] = this._array[3],
                "rgba(" + t[0] + "," + t[1] + "," + t[2] + "," + t[3] + ")"
            }
            ,
            n.Color.prototype._getAlpha = function() {
                return this._array[3] * this.maxes[this.mode][3]
            }
            ,
            n.Color.prototype._getBlue = function() {
                return this._array[2] * this.maxes[i.RGB][2]
            }
            ,
            n.Color.prototype._getBrightness = function() {
                return this.hsba || (this.hsba = o._rgbaToHSBA(this._array)),
                this.hsba[2] * this.maxes[i.HSB][2]
            }
            ,
            n.Color.prototype._getGreen = function() {
                return this._array[1] * this.maxes[i.RGB][1]
            }
            ,
            n.Color.prototype._getHue = function() {
                return this.mode === i.HSB ? (this.hsba || (this.hsba = o._rgbaToHSBA(this._array)),
                this.hsba[0] * this.maxes[i.HSB][0]) : (this.hsla || (this.hsla = o._rgbaToHSLA(this._array)),
                this.hsla[0] * this.maxes[i.HSL][0])
            }
            ,
            n.Color.prototype._getLightness = function() {
                return this.hsla || (this.hsla = o._rgbaToHSLA(this._array)),
                this.hsla[2] * this.maxes[i.HSL][2]
            }
            ,
            n.Color.prototype._getRed = function() {
                return this._array[0] * this.maxes[i.RGB][0]
            }
            ,
            n.Color.prototype._getSaturation = function() {
                return this.mode === i.HSB ? (this.hsba || (this.hsba = o._rgbaToHSBA(this._array)),
                this.hsba[1] * this.maxes[i.HSB][1]) : (this.hsla || (this.hsla = o._rgbaToHSLA(this._array)),
                this.hsla[1] * this.maxes[i.HSL][1])
            }
            ;
            var s = {
                aliceblue: "#f0f8ff",
                antiquewhite: "#faebd7",
                aqua: "#00ffff",
                aquamarine: "#7fffd4",
                azure: "#f0ffff",
                beige: "#f5f5dc",
                bisque: "#ffe4c4",
                black: "#000000",
                blanchedalmond: "#ffebcd",
                blue: "#0000ff",
                blueviolet: "#8a2be2",
                brown: "#a52a2a",
                burlywood: "#deb887",
                cadetblue: "#5f9ea0",
                chartreuse: "#7fff00",
                chocolate: "#d2691e",
                coral: "#ff7f50",
                cornflowerblue: "#6495ed",
                cornsilk: "#fff8dc",
                crimson: "#dc143c",
                cyan: "#00ffff",
                darkblue: "#00008b",
                darkcyan: "#008b8b",
                darkgoldenrod: "#b8860b",
                darkgray: "#a9a9a9",
                darkgreen: "#006400",
                darkgrey: "#a9a9a9",
                darkkhaki: "#bdb76b",
                darkmagenta: "#8b008b",
                darkolivegreen: "#556b2f",
                darkorange: "#ff8c00",
                darkorchid: "#9932cc",
                darkred: "#8b0000",
                darksalmon: "#e9967a",
                darkseagreen: "#8fbc8f",
                darkslateblue: "#483d8b",
                darkslategray: "#2f4f4f",
                darkslategrey: "#2f4f4f",
                darkturquoise: "#00ced1",
                darkviolet: "#9400d3",
                deeppink: "#ff1493",
                deepskyblue: "#00bfff",
                dimgray: "#696969",
                dimgrey: "#696969",
                dodgerblue: "#1e90ff",
                firebrick: "#b22222",
                floralwhite: "#fffaf0",
                forestgreen: "#228b22",
                fuchsia: "#ff00ff",
                gainsboro: "#dcdcdc",
                ghostwhite: "#f8f8ff",
                gold: "#ffd700",
                goldenrod: "#daa520",
                gray: "#808080",
                green: "#008000",
                greenyellow: "#adff2f",
                grey: "#808080",
                honeydew: "#f0fff0",
                hotpink: "#ff69b4",
                indianred: "#cd5c5c",
                indigo: "#4b0082",
                ivory: "#fffff0",
                khaki: "#f0e68c",
                lavender: "#e6e6fa",
                lavenderblush: "#fff0f5",
                lawngreen: "#7cfc00",
                lemonchiffon: "#fffacd",
                lightblue: "#add8e6",
                lightcoral: "#f08080",
                lightcyan: "#e0ffff",
                lightgoldenrodyellow: "#fafad2",
                lightgray: "#d3d3d3",
                lightgreen: "#90ee90",
                lightgrey: "#d3d3d3",
                lightpink: "#ffb6c1",
                lightsalmon: "#ffa07a",
                lightseagreen: "#20b2aa",
                lightskyblue: "#87cefa",
                lightslategray: "#778899",
                lightslategrey: "#778899",
                lightsteelblue: "#b0c4de",
                lightyellow: "#ffffe0",
                lime: "#00ff00",
                limegreen: "#32cd32",
                linen: "#faf0e6",
                magenta: "#ff00ff",
                maroon: "#800000",
                mediumaquamarine: "#66cdaa",
                mediumblue: "#0000cd",
                mediumorchid: "#ba55d3",
                mediumpurple: "#9370db",
                mediumseagreen: "#3cb371",
                mediumslateblue: "#7b68ee",
                mediumspringgreen: "#00fa9a",
                mediumturquoise: "#48d1cc",
                mediumvioletred: "#c71585",
                midnightblue: "#191970",
                mintcream: "#f5fffa",
                mistyrose: "#ffe4e1",
                moccasin: "#ffe4b5",
                navajowhite: "#ffdead",
                navy: "#000080",
                oldlace: "#fdf5e6",
                olive: "#808000",
                olivedrab: "#6b8e23",
                orange: "#ffa500",
                orangered: "#ff4500",
                orchid: "#da70d6",
                palegoldenrod: "#eee8aa",
                palegreen: "#98fb98",
                paleturquoise: "#afeeee",
                palevioletred: "#db7093",
                papayawhip: "#ffefd5",
                peachpuff: "#ffdab9",
                peru: "#cd853f",
                pink: "#ffc0cb",
                plum: "#dda0dd",
                powderblue: "#b0e0e6",
                purple: "#800080",
                red: "#ff0000",
                rosybrown: "#bc8f8f",
                royalblue: "#4169e1",
                saddlebrown: "#8b4513",
                salmon: "#fa8072",
                sandybrown: "#f4a460",
                seagreen: "#2e8b57",
                seashell: "#fff5ee",
                sienna: "#a0522d",
                silver: "#c0c0c0",
                skyblue: "#87ceeb",
                slateblue: "#6a5acd",
                slategray: "#708090",
                slategrey: "#708090",
                snow: "#fffafa",
                springgreen: "#00ff7f",
                steelblue: "#4682b4",
                tan: "#d2b48c",
                teal: "#008080",
                thistle: "#d8bfd8",
                tomato: "#ff6347",
                turquoise: "#40e0d0",
                violet: "#ee82ee",
                wheat: "#f5deb3",
                white: "#ffffff",
                whitesmoke: "#f5f5f5",
                yellow: "#ffff00",
                yellowgreen: "#9acd32"
            }
              , a = /\s*/
              , h = /(\d{1,3})/
              , u = /((?:\d+(?:\.\d+)?)|(?:\.\d+))/
              , l = new RegExp(u.source + "%")
              , p = {
                HEX3: /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,
                HEX6: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
                RGB: new RegExp(["^rgb\\(", h.source, ",", h.source, ",", h.source, "\\)$"].join(a.source),"i"),
                RGB_PERCENT: new RegExp(["^rgb\\(", l.source, ",", l.source, ",", l.source, "\\)$"].join(a.source),"i"),
                RGBA: new RegExp(["^rgba\\(", h.source, ",", h.source, ",", h.source, ",", u.source, "\\)$"].join(a.source),"i"),
                RGBA_PERCENT: new RegExp(["^rgba\\(", l.source, ",", l.source, ",", l.source, ",", u.source, "\\)$"].join(a.source),"i"),
                HSL: new RegExp(["^hsl\\(", h.source, ",", l.source, ",", l.source, "\\)$"].join(a.source),"i"),
                HSLA: new RegExp(["^hsla\\(", h.source, ",", l.source, ",", l.source, ",", u.source, "\\)$"].join(a.source),"i"),
                HSB: new RegExp(["^hsb\\(", h.source, ",", l.source, ",", l.source, "\\)$"].join(a.source),"i"),
                HSBA: new RegExp(["^hsba\\(", h.source, ",", l.source, ",", l.source, ",", u.source, "\\)$"].join(a.source),"i")
            };
            n.Color._parseInputs = function() {
                var t = arguments.length
                  , e = this._colorMode
                  , r = this._colorMaxes
                  , a = [];
                if (t >= 3)
                    return a[0] = arguments[0] / r[e][0],
                    a[1] = arguments[1] / r[e][1],
                    a[2] = arguments[2] / r[e][2],
                    "number" == typeof arguments[3] ? a[3] = arguments[3] / r[e][3] : a[3] = 1,
                    a = a.map(function(t) {
                        return Math.max(Math.min(t, 1), 0)
                    }),
                    e === i.HSL ? o._hslaToRGBA(a) : e === i.HSB ? o._hsbaToRGBA(a) : a;
                if (1 === t && "string" == typeof arguments[0]) {
                    var h = arguments[0].trim().toLowerCase();
                    if (s[h])
                        return n.Color._parseInputs.apply(this, [s[h]]);
                    if (p.HEX3.test(h))
                        return a = p.HEX3.exec(h).slice(1).map(function(t) {
                            return parseInt(t + t, 16) / 255
                        }),
                        a[3] = 1,
                        a;
                    if (p.HEX6.test(h))
                        return a = p.HEX6.exec(h).slice(1).map(function(t) {
                            return parseInt(t, 16) / 255
                        }),
                        a[3] = 1,
                        a;
                    if (p.RGB.test(h))
                        return a = p.RGB.exec(h).slice(1).map(function(t) {
                            return t / 255
                        }),
                        a[3] = 1,
                        a;
                    if (p.RGB_PERCENT.test(h))
                        return a = p.RGB_PERCENT.exec(h).slice(1).map(function(t) {
                            return parseFloat(t) / 100
                        }),
                        a[3] = 1,
                        a;
                    if (p.RGBA.test(h))
                        return a = p.RGBA.exec(h).slice(1).map(function(t, e) {
                            return 3 === e ? parseFloat(t) : t / 255
                        });
                    if (p.RGBA_PERCENT.test(h))
                        return a = p.RGBA_PERCENT.exec(h).slice(1).map(function(t, e) {
                            return 3 === e ? parseFloat(t) : parseFloat(t) / 100
                        });
                    if (p.HSL.test(h) ? (a = p.HSL.exec(h).slice(1).map(function(t, e) {
                        return 0 === e ? parseInt(t, 10) / 360 : parseInt(t, 10) / 100
                    }),
                    a[3] = 1) : p.HSLA.test(h) && (a = p.HSLA.exec(h).slice(1).map(function(t, e) {
                        return 0 === e ? parseInt(t, 10) / 360 : 3 === e ? parseFloat(t) : parseInt(t, 10) / 100
                    })),
                    a.length)
                        return o._hslaToRGBA(a);
                    if (p.HSB.test(h) ? (a = p.HSB.exec(h).slice(1).map(function(t, e) {
                        return 0 === e ? parseInt(t, 10) / 360 : parseInt(t, 10) / 100
                    }),
                    a[3] = 1) : p.HSBA.test(h) && (a = p.HSBA.exec(h).slice(1).map(function(t, e) {
                        return 0 === e ? parseInt(t, 10) / 360 : 3 === e ? parseFloat(t) : parseInt(t, 10) / 100
                    })),
                    a.length)
                        return o._hsbaToRGBA(a);
                    a = [1, 1, 1, 1]
                } else {
                    if (1 !== t && 2 !== t || "number" != typeof arguments[0])
                        throw new Error(arguments + "is not a valid color representation.");
                    a[0] = arguments[0] / r[e][2],
                    a[1] = arguments[0] / r[e][2],
                    a[2] = arguments[0] / r[e][2],
                    "number" == typeof arguments[1] ? a[3] = arguments[1] / r[e][3] : a[3] = 1,
                    a = a.map(function(t) {
                        return Math.max(Math.min(t, 1), 0)
                    })
                }
                return a
            }
            ,
            e.exports = n.Color
        }
        , {
            "../core/constants": 36,
            "../core/core": 37,
            "./color_conversion": 29
        }],
        32: [function(t, e, r) {
            "use strict";
            var n = t("../core/core")
              , i = t("../core/constants");
            t("./p5.Color"),
            n.prototype.background = function() {
                return arguments[0]instanceof n.Image ? this.image(arguments[0], 0, 0, this.width, this.height) : this._renderer.background.apply(this._renderer, arguments),
                this
            }
            ,
            n.prototype.clear = function() {
                return this._renderer.clear(),
                this
            }
            ,
            n.prototype.colorMode = function() {
                if (arguments[0] === i.RGB || arguments[0] === i.HSB || arguments[0] === i.HSL) {
                    this._renderer._colorMode = arguments[0];
                    var t = this._renderer._colorMaxes[this._renderer._colorMode];
                    2 === arguments.length ? (t[0] = arguments[1],
                    t[1] = arguments[1],
                    t[2] = arguments[1],
                    t[3] = arguments[1]) : 4 === arguments.length ? (t[0] = arguments[1],
                    t[1] = arguments[2],
                    t[2] = arguments[3]) : 5 === arguments.length && (t[0] = arguments[1],
                    t[1] = arguments[2],
                    t[2] = arguments[3],
                    t[3] = arguments[4])
                }
                return this
            }
            ,
            n.prototype.fill = function() {
                return this._renderer._setProperty("_fillSet", !0),
                this._renderer._setProperty("_doFill", !0),
                this._renderer.fill.apply(this._renderer, arguments),
                this
            }
            ,
            n.prototype.noFill = function() {
                return this._renderer._setProperty("_doFill", !1),
                this
            }
            ,
            n.prototype.noStroke = function() {
                return this._renderer._setProperty("_doStroke", !1),
                this
            }
            ,
            n.prototype.stroke = function() {
                return this._renderer._setProperty("_strokeSet", !0),
                this._renderer._setProperty("_doStroke", !0),
                this._renderer.stroke.apply(this._renderer, arguments),
                this
            }
            ,
            e.exports = n
        }
        , {
            "../core/constants": 36,
            "../core/core": 37,
            "./p5.Color": 31
        }],
        33: [function(t, e, r) {
            "use strict";
            var n = t("./core")
              , i = t("./constants");
            t("./error_helpers"),
            n.prototype.arc = function(t, e, r, n, o, s, a) {
                for (var h = new Array(arguments.length), u = 0; u < h.length; ++u)
                    h[u] = arguments[u];
                if (!this._renderer._doStroke && !this._renderer._doFill)
                    return this;
                for (this._angleMode === i.DEGREES && (o = this.radians(o),
                s = this.radians(s)); 0 > o; )
                    o += i.TWO_PI;
                for (; 0 > s; )
                    s += i.TWO_PI;
                return o %= i.TWO_PI,
                s %= i.TWO_PI,
                s === o && (s += i.TWO_PI),
                o = o <= i.HALF_PI ? Math.atan(r / n * Math.tan(o)) : o > i.HALF_PI && o <= 3 * i.HALF_PI ? Math.atan(r / n * Math.tan(o)) + i.PI : Math.atan(r / n * Math.tan(o)) + i.TWO_PI,
                s = s <= i.HALF_PI ? Math.atan(r / n * Math.tan(s)) : s > i.HALF_PI && s <= 3 * i.HALF_PI ? Math.atan(r / n * Math.tan(s)) + i.PI : Math.atan(r / n * Math.tan(s)) + i.TWO_PI,
                o > s && (s += i.TWO_PI),
                r = Math.abs(r),
                n = Math.abs(n),
                this._renderer.arc(t, e, r, n, o, s, a),
                this
            }
            ,
            n.prototype.ellipse = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                return 3 === t.length && t.push(t[2]),
                this._renderer.isP3D ? (t[3] < 0 && (t[3] = Math.abs(t[3])),
                t[4] < 0 && (t[4] = Math.abs(t[4]))) : (t[2] < 0 && (t[2] = Math.abs(t[2])),
                t[3] < 0 && (t[3] = Math.abs(t[3]))),
                this._renderer._doStroke || this._renderer._doFill ? (this._renderer.isP3D ? this._renderer.ellipse(t) : this._renderer.ellipse(t[0], t[1], t[2], t[3]),
                this) : this
            }
            ,
            n.prototype.line = function() {
                if (!this._renderer._doStroke)
                    return this;
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                return this._renderer.isP3D ? this._renderer.line(t[0], t[1], t[2], t[3], t[4], t[5]) : this._renderer.line(t[0], t[1], t[2], t[3]),
                this
            }
            ,
            n.prototype.point = function() {
                if (!this._renderer._doStroke)
                    return this;
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                return this._renderer.isP3D ? this._renderer.point(t[0], t[1], t[2]) : this._renderer.point(t[0], t[1]),
                this
            }
            ,
            n.prototype.quad = function() {
                if (!this._renderer._doStroke && !this._renderer._doFill)
                    return this;
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                return this._renderer.isP3D ? this._renderer.quad(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11]) : this._renderer.quad(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7]),
                this
            }
            ,
            n.prototype.rect = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                return this._renderer.isP3D ? (t[3] < 0 && (t[3] = Math.abs(t[3])),
                t[4] < 0 && (t[4] = Math.abs(t[4]))) : this._renderer._rectMode !== i.CORNERS && (t[2] < 0 && (t[2] = Math.abs(t[2])),
                t[3] < 0 && (t[3] = Math.abs(t[3]))),
                this._renderer._doStroke || this._renderer._doFill ? (this._renderer.rect(t),
                this) : void 0
            }
            ,
            n.prototype.triangle = function() {
                if (!this._renderer._doStroke && !this._renderer._doFill)
                    return this;
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                return this._renderer.isP3D ? this._renderer.triangle(t) : this._renderer.triangle(t[0], t[1], t[2], t[3], t[4], t[5]),
                this
            }
            ,
            e.exports = n
        }
        , {
            "./constants": 36,
            "./core": 37,
            "./error_helpers": 40
        }],
        34: [function(t, e, r) {
            "use strict";
            var n = t("./core")
              , i = t("./constants");
            n.prototype.ellipseMode = function(t) {
                return (t === i.CORNER || t === i.CORNERS || t === i.RADIUS || t === i.CENTER) && (this._renderer._ellipseMode = t),
                this
            }
            ,
            n.prototype.noSmooth = function() {
                return this._renderer.noSmooth(),
                this
            }
            ,
            n.prototype.rectMode = function(t) {
                return (t === i.CORNER || t === i.CORNERS || t === i.RADIUS || t === i.CENTER) && (this._renderer._rectMode = t),
                this
            }
            ,
            n.prototype.smooth = function() {
                return this._renderer.smooth(),
                this
            }
            ,
            n.prototype.strokeCap = function(t) {
                return (t === i.ROUND || t === i.SQUARE || t === i.PROJECT) && this._renderer.strokeCap(t),
                this
            }
            ,
            n.prototype.strokeJoin = function(t) {
                return (t === i.ROUND || t === i.BEVEL || t === i.MITER) && this._renderer.strokeJoin(t),
                this
            }
            ,
            n.prototype.strokeWeight = function(t) {
                return this._renderer.strokeWeight(t),
                this
            }
            ,
            e.exports = n
        }
        , {
            "./constants": 36,
            "./core": 37
        }],
        35: [function(t, e, r) {
            var n = t("./constants");
            e.exports = {
                modeAdjust: function(t, e, r, i, o) {
                    return o === n.CORNER ? {
                        x: t,
                        y: e,
                        w: r,
                        h: i
                    } : o === n.CORNERS ? {
                        x: t,
                        y: e,
                        w: r - t,
                        h: i - e
                    } : o === n.RADIUS ? {
                        x: t - r,
                        y: e - i,
                        w: 2 * r,
                        h: 2 * i
                    } : o === n.CENTER ? {
                        x: t - .5 * r,
                        y: e - .5 * i,
                        w: r,
                        h: i
                    } : void 0
                },
                arcModeAdjust: function(t, e, r, i, o) {
                    return o === n.CORNER ? {
                        x: t + .5 * r,
                        y: e + .5 * i,
                        w: r,
                        h: i
                    } : o === n.CORNERS ? {
                        x: t,
                        y: e,
                        w: r + t,
                        h: i + e
                    } : o === n.RADIUS ? {
                        x: t,
                        y: e,
                        w: 2 * r,
                        h: 2 * i
                    } : o === n.CENTER ? {
                        x: t,
                        y: e,
                        w: r,
                        h: i
                    } : void 0
                }
            }
        }
        , {
            "./constants": 36
        }],
        36: [function(t, e, r) {
            var n = Math.PI;
            e.exports = {
                P2D: "p2d",
                WEBGL: "webgl",
                ARROW: "default",
                CROSS: "crosshair",
                HAND: "pointer",
                MOVE: "move",
                TEXT: "text",
                WAIT: "wait",
                HALF_PI: n / 2,
                PI: n,
                QUARTER_PI: n / 4,
                TAU: 2 * n,
                TWO_PI: 2 * n,
                DEGREES: "degrees",
                RADIANS: "radians",
                CORNER: "corner",
                CORNERS: "corners",
                RADIUS: "radius",
                RIGHT: "right",
                LEFT: "left",
                CENTER: "center",
                TOP: "top",
                BOTTOM: "bottom",
                BASELINE: "alphabetic",
                POINTS: 0,
                LINES: 1,
                LINE_STRIP: 3,
                LINE_LOOP: 2,
                TRIANGLES: 4,
                TRIANGLE_FAN: 6,
                TRIANGLE_STRIP: 5,
                QUADS: "quads",
                QUAD_STRIP: "quad_strip",
                CLOSE: "close",
                OPEN: "open",
                CHORD: "chord",
                PIE: "pie",
                PROJECT: "square",
                SQUARE: "butt",
                ROUND: "round",
                BEVEL: "bevel",
                MITER: "miter",
                RGB: "rgb",
                HSB: "hsb",
                HSL: "hsl",
                AUTO: "auto",
                ALT: 18,
                BACKSPACE: 8,
                CONTROL: 17,
                DELETE: 46,
                DOWN_ARROW: 40,
                ENTER: 13,
                ESCAPE: 27,
                LEFT_ARROW: 37,
                OPTION: 18,
                RETURN: 13,
                RIGHT_ARROW: 39,
                SHIFT: 16,
                TAB: 9,
                UP_ARROW: 38,
                BLEND: "normal",
                ADD: "lighter",
                DARKEST: "darken",
                LIGHTEST: "lighten",
                DIFFERENCE: "difference",
                EXCLUSION: "exclusion",
                MULTIPLY: "multiply",
                SCREEN: "screen",
                REPLACE: "source-over",
                OVERLAY: "overlay",
                HARD_LIGHT: "hard-light",
                SOFT_LIGHT: "soft-light",
                DODGE: "color-dodge",
                BURN: "color-burn",
                THRESHOLD: "threshold",
                GRAY: "gray",
                OPAQUE: "opaque",
                INVERT: "invert",
                POSTERIZE: "posterize",
                DILATE: "dilate",
                ERODE: "erode",
                BLUR: "blur",
                NORMAL: "normal",
                ITALIC: "italic",
                BOLD: "bold",
                _DEFAULT_TEXT_FILL: "#000000",
                _DEFAULT_LEADMULT: 1.25,
                _CTX_MIDDLE: "middle",
                LINEAR: "linear",
                QUADRATIC: "quadratic",
                BEZIER: "bezier",
                CURVE: "curve",
                _DEFAULT_STROKE: "#000000",
                _DEFAULT_FILL: "#FFFFFF"
            }
        }
        , {}],
        37: [function(t, e, r) {
            "use strict";
            t("./shim");
            var n = t("./constants")
              , i = function(t, e, r) {
                2 === arguments.length && "boolean" == typeof e && (r = e,
                e = void 0),
                this._setupDone = !1,
                this._pixelDensity = Math.ceil(window.devicePixelRatio) || 1,
                this._userNode = e,
                this._curElement = null,
                this._elements = [],
                this._requestAnimId = 0,
                this._preloadCount = 0,
                this._isGlobal = !1,
                this._loop = !0,
                this._styles = [],
                this._defaultCanvasSize = {
                    width: 100,
                    height: 100
                },
                this._events = {
                    mousemove: null,
                    mousedown: null,
                    mouseup: null,
                    dragend: null,
                    dragover: null,
                    click: null,
                    mouseover: null,
                    mouseout: null,
                    keydown: null,
                    keyup: null,
                    keypress: null,
                    touchstart: null,
                    touchmove: null,
                    touchend: null,
                    resize: null,
                    blur: null
                },
                this._events.wheel = null,
                this._loadingScreenId = "p5_loading",
                window.DeviceOrientationEvent && (this._events.deviceorientation = null),
                window.DeviceMotionEvent && !window._isNodeWebkit && (this._events.devicemotion = null),
                this._start = function() {
                    this._userNode && "string" == typeof this._userNode && (this._userNode = document.getElementById(this._userNode)),
                    this.createCanvas(this._defaultCanvasSize.width, this._defaultCanvasSize.height, "p2d", !0);
                    var t = this.preload || window.preload;
                    if (t) {
                        var e = document.getElementById(this._loadingScreenId);
                        if (!e) {
                            e = document.createElement("div"),
                            e.innerHTML = "Loading...",
                            e.style.position = "absolute",
                            e.id = this._loadingScreenId;
                            var r = this._userNode || document.body;
                            r.appendChild(e)
                        }
                        for (var n in this._preloadMethods) {
                            this._preloadMethods[n] = this._preloadMethods[n] || i;
                            var o = this._preloadMethods[n];
                            (o === i.prototype || o === i) && (o = this._isGlobal ? window : this),
                            this._registeredPreloadMethods[n] = o[n],
                            o[n] = this._wrapPreload(o, n)
                        }
                        t(),
                        this._runIfPreloadsAreDone()
                    } else
                        this._setup(),
                        this._runFrames(),
                        this._draw()
                }
                .bind(this),
                this._runIfPreloadsAreDone = function() {
                    var t = this._isGlobal ? window : this;
                    if (0 === t._preloadCount) {
                        var e = document.getElementById(t._loadingScreenId);
                        e && e.parentNode.removeChild(e),
                        t._setup(),
                        t._runFrames(),
                        t._draw()
                    }
                }
                ,
                this._decrementPreload = function() {
                    var t = this._isGlobal ? window : this;
                    t._setProperty("_preloadCount", t._preloadCount - 1),
                    t._runIfPreloadsAreDone()
                }
                ,
                this._wrapPreload = function(t, e) {
                    return function() {
                        this._incrementPreload();
                        var r = Array.prototype.slice.call(arguments);
                        return r.push(this._decrementPreload.bind(this)),
                        this._registeredPreloadMethods[e].apply(t, r)
                    }
                    .bind(this)
                }
                ,
                this._incrementPreload = function() {
                    var t = this._isGlobal ? window : this;
                    t._setProperty("_preloadCount", t._preloadCount + 1)
                }
                ,
                this._setup = function() {
                    var t = this._isGlobal ? window : this;
                    if ("function" == typeof t.preload)
                        for (var e in this._preloadMethods)
                            t[e] = this._preloadMethods[e][e],
                            t[e] && this && (t[e] = t[e].bind(this));
                    "function" == typeof t.setup && t.setup();
                    for (var r = document.getElementsByTagName("canvas"), n = 0; n < r.length; n++) {
                        var i = r[n];
                        "true" === i.dataset.hidden && (i.style.visibility = "",
                        delete i.dataset.hidden)
                    }
                    this._setupDone = !0
                }
                .bind(this),
                this._draw = function() {
                    var t = window.performance.now()
                      , e = t - this._lastFrameTime
                      , r = 1e3 / this._targetFrameRate
                      , n = 5;
                    (!this._loop || e >= r - n) && (this.resetMatrix(),
                    this._renderer.isP3D && this._renderer._update(),
                    this._setProperty("frameCount", this.frameCount + 1),
                    this._updateMouseCoords(),
                    this._updateTouchCoords(),
                    this.redraw(),
                    this._frameRate = 1e3 / (t - this._lastFrameTime),
                    this._lastFrameTime = t),
                    this._loop && (this._requestAnimId = window.requestAnimationFrame(this._draw))
                }
                .bind(this),
                this._runFrames = function() {
                    this._updateInterval && clearInterval(this._updateInterval)
                }
                .bind(this),
                this._setProperty = function(t, e) {
                    this[t] = e,
                    this._isGlobal && (window[t] = e)
                }
                .bind(this),
                this.remove = function() {
                    if (this._curElement) {
                        this._loop = !1,
                        this._requestAnimId && window.cancelAnimationFrame(this._requestAnimId);
                        for (var t in this._events)
                            window.removeEventListener(t, this._events[t]);
                        for (var e = 0; e < this._elements.length; e++) {
                            var r = this._elements[e];
                            r.elt.parentNode && r.elt.parentNode.removeChild(r.elt);
                            for (var n in r._events)
                                r.elt.removeEventListener(n, r._events[n])
                        }
                        var o = this;
                        if (this._registeredMethods.remove.forEach(function(t) {
                            "undefined" != typeof t && t.call(o)
                        }),
                        this._isGlobal) {
                            for (var s in i.prototype)
                                try {
                                    delete window[s]
                                } catch (a) {
                                    window[s] = void 0
                                }
                            for (var h in this)
                                if (this.hasOwnProperty(h))
                                    try {
                                        delete window[h]
                                    } catch (a) {
                                        window[h] = void 0
                                    }
                        }
                    }
                }
                .bind(this),
                this._registeredMethods.init.forEach(function(t) {
                    "undefined" != typeof t && t.call(this)
                }, this);
                var n = this._createFriendlyGlobalFunctionBinder();
                if (t)
                    t(this);
                else {
                    this._isGlobal = !0;
                    for (var o in i.prototype)
                        if ("function" == typeof i.prototype[o]) {
                            var s = o.substring(2);
                            this._events.hasOwnProperty(s) || n(o, i.prototype[o].bind(this))
                        } else
                            n(o, i.prototype[o]);
                    for (var a in this)
                        this.hasOwnProperty(a) && n(a, this[a])
                }
                for (var h in this._events) {
                    var u = this["_on" + h];
                    if (u) {
                        var l = u.bind(this);
                        window.addEventListener(h, l),
                        this._events[h] = l
                    }
                }
                var p = function() {
                    this._setProperty("focused", !0)
                }
                .bind(this)
                  , c = function() {
                    this._setProperty("focused", !1)
                }
                .bind(this);
                window.addEventListener("focus", p),
                window.addEventListener("blur", c),
                this.registerMethod("remove", function() {
                    window.removeEventListener("focus", p),
                    window.removeEventListener("blur", c)
                }),
                r ? this._start() : "complete" === document.readyState ? this._start() : window.addEventListener("load", this._start.bind(this), !1)
            };
            for (var o in n)
                i.prototype[o] = n[o];
            i.prototype._preloadMethods = {
                loadJSON: i.prototype,
                loadImage: i.prototype,
                loadStrings: i.prototype,
                loadXML: i.prototype,
                loadShape: i.prototype,
                loadTable: i.prototype,
                loadFont: i.prototype,
                loadModel: i.prototype
            },
            i.prototype._registeredMethods = {
                init: [],
                pre: [],
                post: [],
                remove: []
            },
            i.prototype._registeredPreloadMethods = {},
            i.prototype.registerPreloadMethod = function(t, e) {
                i.prototype._preloadMethods.hasOwnProperty(t) || (i.prototype._preloadMethods[t] = e)
            }
            ,
            i.prototype.registerMethod = function(t, e) {
                i.prototype._registeredMethods.hasOwnProperty(t) || (i.prototype._registeredMethods[t] = []),
                i.prototype._registeredMethods[t].push(e)
            }
            ,
            i.prototype._createFriendlyGlobalFunctionBinder = function(t) {
                t = t || {};
                var e = t.globalObject || window;
                return t.log || console.log.bind(console),
                function(t, r) {
                    e[t] = r
                }
            }
            ,
            e.exports = i
        }
        , {
            "./constants": 36,
            "./shim": 46
        }],
        38: [function(t, e, r) {
            "use strict";
            var n = t("./core");
            t("./error_helpers");
            var i = 20
              , o = 20;
            n.prototype.bezier = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                return this._renderer.isP3D ? this._validateParameters("bezier", t, ["Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number"]) : this._validateParameters("bezier", t, ["Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number"]),
                this._renderer._doStroke ? (this._renderer.isP3D ? (t.push(i),
                this._renderer.bezier(t)) : this._renderer.bezier(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7]),
                this) : this
            }
            ,
            n.prototype.bezierDetail = function(t) {
                return i = t,
                this
            }
            ,
            n.prototype.bezierPoint = function(t, e, r, n, i) {
                var o = 1 - i;
                return Math.pow(o, 3) * t + 3 * Math.pow(o, 2) * i * e + 3 * o * Math.pow(i, 2) * r + Math.pow(i, 3) * n
            }
            ,
            n.prototype.bezierTangent = function(t, e, r, n, i) {
                var o = 1 - i;
                return 3 * n * Math.pow(i, 2) - 3 * r * Math.pow(i, 2) + 6 * r * o * i - 6 * e * o * i + 3 * e * Math.pow(o, 2) - 3 * t * Math.pow(o, 2)
            }
            ,
            n.prototype.curve = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                return this._renderer.isP3D ? this._validateParameters("curve", t, ["Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number"]) : this._validateParameters("curve", t, ["Number", "Number", "Number", "Number", "Number", "Number", "Number", "Number"]),
                this._renderer._doStroke ? (this._renderer.isP3D ? (t.push(o),
                this._renderer.curve(t)) : this._renderer.curve(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7]),
                this) : this
            }
            ,
            n.prototype.curveDetail = function(t) {
                return o = t,
                this
            }
            ,
            n.prototype.curveTightness = function(t) {
                this._renderer._curveTightness = t
            }
            ,
            n.prototype.curvePoint = function(t, e, r, n, i) {
                var o = i * i * i
                  , s = i * i
                  , a = -.5 * o + s - .5 * i
                  , h = 1.5 * o - 2.5 * s + 1
                  , u = -1.5 * o + 2 * s + .5 * i
                  , l = .5 * o - .5 * s;
                return t * a + e * h + r * u + n * l
            }
            ,
            n.prototype.curveTangent = function(t, e, r, n, i) {
                var o = i * i
                  , s = -3 * o / 2 + 2 * i - .5
                  , a = 9 * o / 2 - 5 * i
                  , h = -9 * o / 2 + 4 * i + .5
                  , u = 3 * o / 2 - i;
                return t * s + e * a + r * h + n * u
            }
            ,
            e.exports = n
        }
        , {
            "./core": 37,
            "./error_helpers": 40
        }],
        39: [function(t, e, r) {
            "use strict";
            function n(t) {
                var e = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
                if (!e)
                    throw new Error("Fullscreen not enabled in this browser.");
                t.requestFullscreen ? t.requestFullscreen() : t.mozRequestFullScreen ? t.mozRequestFullScreen() : t.webkitRequestFullscreen ? t.webkitRequestFullscreen() : t.msRequestFullscreen && t.msRequestFullscreen()
            }
            function i() {
                document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.msExitFullscreen && document.msExitFullscreen()
            }
            var o = t("./core")
              , s = t("./constants")
              , a = [s.ARROW, s.CROSS, s.HAND, s.MOVE, s.TEXT, s.WAIT];
            o.prototype._frameRate = 0,
            o.prototype._lastFrameTime = window.performance.now(),
            o.prototype._targetFrameRate = 60,
            window.console && console.log ? o.prototype.print = function(t) {
                try {
                    var e = JSON.parse(JSON.stringify(t));
                    console.log(e)
                } catch (r) {
                    console.log(t)
                }
            }
            : o.prototype.print = function() {}
            ,
            o.prototype.println = o.prototype.print,
            o.prototype.frameCount = 0,
            o.prototype.focused = document.hasFocus(),
            o.prototype.cursor = function(t, e, r) {
                var n = "auto"
                  , i = this._curElement.elt;
                if (a.indexOf(t) > -1)
                    n = t;
                else if ("string" == typeof t) {
                    var o = "";
                    e && r && "number" == typeof e && "number" == typeof r && (o = e + " " + r),
                    n = "http://" !== t.substring(0, 6) ? "url(" + t + ") " + o + ", auto" : /\.(cur|jpg|jpeg|gif|png|CUR|JPG|JPEG|GIF|PNG)$/.test(t) ? "url(" + t + ") " + o + ", auto" : t
                }
                i.style.cursor = n
            }
            ,
            o.prototype.frameRate = function(t) {
                return "number" != typeof t || 0 >= t ? this._frameRate : (this._setProperty("_targetFrameRate", t),
                this._runFrames(),
                this)
            }
            ,
            o.prototype.getFrameRate = function() {
                return this.frameRate()
            }
            ,
            o.prototype.setFrameRate = function(t) {
                return this.frameRate(t)
            }
            ,
            o.prototype.noCursor = function() {
                this._curElement.elt.style.cursor = "none"
            }
            ,
            o.prototype.displayWidth = screen.width,
            o.prototype.displayHeight = screen.height,
            o.prototype.windowWidth = document.documentElement.clientWidth,
            o.prototype.windowHeight = document.documentElement.clientHeight,
            o.prototype._onresize = function(t) {
                this._setProperty("windowWidth", window.innerWidth),
                this._setProperty("windowHeight", window.innerHeight);
                var e, r = this._isGlobal ? window : this;
                "function" == typeof r.windowResized && (e = r.windowResized(t),
                void 0 === e || e || t.preventDefault())
            }
            ,
            o.prototype.width = 0,
            o.prototype.height = 0,
            o.prototype.fullscreen = function(t) {
                return "undefined" == typeof t ? document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement : void (t ? n(document.documentElement) : i())
            }
            ,
            o.prototype.pixelDensity = function(t) {
                return "number" != typeof t ? this._pixelDensity : (this._pixelDensity = t,
                void this.resizeCanvas(this.width, this.height, !0))
            }
            ,
            o.prototype.displayDensity = function() {
                return window.devicePixelRatio
            }
            ,
            o.prototype.getURL = function() {
                return location.href
            }
            ,
            o.prototype.getURLPath = function() {
                return location.pathname.split("/").filter(function(t) {
                    return "" !== t
                })
            }
            ,
            o.prototype.getURLParams = function() {
                for (var t, e = /[?&]([^&=]+)(?:[&=])([^&=]+)/gim, r = {}; null != (t = e.exec(location.search)); )
                    t.index === e.lastIndex && e.lastIndex++,
                    r[t[1]] = t[2];
                return r
            }
            ,
            e.exports = o
        }
        , {
            "./constants": 36,
            "./core": 37
        }],
        40: [function(t, e, r) {
            "use strict";
            function n(t, e, r) {
                if (t.match(/^p5\./)) {
                    var n = t.split(".");
                    return r instanceof h[n[1]]
                }
                return "Boolean" === t || t.toLowerCase() === e || g.indexOf(t) > -1 && y(r)
            }
            function i(t, e, r) {
                u && (o(),
                u = !1),
                "undefined" === f(r) ? r = "#B40033" : "number" === f(r) && (r = T[r])
            }
            function o() {
                var t = "transparent"
                  , e = "#ED225D"
                  , r = "#ED225D"
                  , n = "white";
                console.log("%c    _ \n /\\| |/\\ \n \\ ` ' /  \n / , . \\  \n \\/|_|\\/ \n\n%c> p5.js says: Welcome! This is your friendly debugger. To turn me off switch to using “p5.min.js”.", "background-color:" + t + ";color:" + e + ";", "background-color:" + r + ";color:" + n + ";")
            }
            function s() {
                var e = {}
                  , r = function(t) {
                    return Object.getOwnPropertyNames(t).filter(function(t) {
                        return "_" === t[0] ? !1 : t in e ? !1 : (e[t] = !0,
                        !0)
                    }).map(function(e) {
                        var r;
                        return r = "function" == typeof t[e] ? "function" : e === e.toUpperCase() ? "constant" : "variable",
                        {
                            name: e,
                            type: r
                        }
                    })
                };
                S = [].concat(r(h.prototype), r(t("./constants"))),
                S.sort(function(t, e) {
                    return e.name.length - t.name.length
                })
            }
            function a(t, e) {
                e || (e = console.log.bind(console)),
                S || s(),
                S.some(function(r) {
                    return t.message && -1 !== t.message.indexOf(r.name) ? (e("%cDid you just try to use p5.js's " + r.name + ("function" === r.type ? "() " : " ") + r.type + "? If so, you may want to move it into your sketch's setup() function.\n\nFor more details, see: " + M, "color: #B40033"),
                    !0) : void 0
                })
            }
            for (var h = t("./core"), u = !1, l = {}, p = l.toString, c = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error"], d = 0; d < c.length; d++)
                l["[object " + c[d] + "]"] = c[d].toLowerCase();
            var f = function(t) {
                return null == t ? t + "" : "object" == typeof t || "function" == typeof t ? l[p.call(t)] || "object" : typeof t
            }
              , m = Array.isArray || function(t) {
                return "array" === f(t)
            }
              , y = function(t) {
                return !m(t) && t - parseFloat(t) + 1 >= 0
            }
              , g = ["Number", "Integer", "Number/Constant"]
              , v = 0
              , _ = 1
              , x = 2
              , b = 3
              , T = ["#2D7BB6", "#EE9900", "#4DB200", "#C83C00"];
            h.prototype._validateParameters = function(t, e, r) {
                m(r[0]) || (r = [r]);
                for (var o, s = Math.abs(e.length - r[0].length), a = 0, h = 1, u = r.length; u > h; h++) {
                    var l = Math.abs(e.length - r[h].length);
                    s >= l && (a = h,
                    s = l)
                }
                var p = "X";
                s > 0 && (o = "You wrote " + t + "(",
                e.length > 0 && (o += p + Array(e.length).join("," + p)),
                o += "). " + t + " was expecting " + r[a].length + " parameters. Try " + t + "(",
                r[a].length > 0 && (o += p + Array(r[a].length).join("," + p)),
                o += ").",
                r.length > 1 && (o += " " + t + " takes different numbers of parameters depending on what you want to do. Click this link to learn more: "),
                i(o, t, v));
                for (var c = 0; c < r.length; c++)
                    for (var d = 0; d < r[c].length && d < e.length; d++) {
                        var y = r[c][d]
                          , g = f(e[d]);
                        "undefined" === g || null === g ? i("It looks like " + t + " received an empty variable in spot #" + (d + 1) + ". If not intentional, this is often a problem with scope: [link to scope].", t, _) : "*" === y || n(y, g, e[d]) || (o = t + " was expecting a " + y.toLowerCase() + " for parameter #" + (d + 1) + ", received ",
                        o += "string" === g ? '"' + e[d] + '"' : e[d],
                        o += " instead.",
                        r.length > 1 && (o += " " + t + " takes different numbers of parameters depending on what you want to do. Click this link to learn more:"),
                        i(o, t, x))
                    }
            }
            ,
            h.prototype._validateParameters = function() {
                return !0
            }
            ;
            var w = {
                0: {
                    fileType: "image",
                    method: "loadImage",
                    message: " hosting the image online,"
                },
                1: {
                    fileType: "XML file",
                    method: "loadXML"
                },
                2: {
                    fileType: "table file",
                    method: "loadTable"
                },
                3: {
                    fileType: "text file",
                    method: "loadStrings"
                }
            };
            h._friendlyFileLoadError = function(t, e) {
                var r = w[t]
                  , n = "It looks like there was a problem loading your " + r.fileType + ". Try checking if the file path%c [" + e + "] %cis correct," + (r.message || "") + " or running a local server.";
                i(n, r.method, b)
            }
            ;
            var S = null
              , M = "https://github.com/processing/p5.js/wiki/Frequently-Asked-Questions#why-cant-i-assign-variables-using-p5-functions-and-variables-before-setup";
            h.prototype._helpForMisusedAtTopLevelCode = a,
            "complete" !== document.readyState && (window.addEventListener("error", a, !1),
            window.addEventListener("load", function() {
                window.removeEventListener("error", a, !1)
            })),
            e.exports = h
        }
        , {
            "./constants": 36,
            "./core": 37
        }],
        41: [function(t, e, r) {
            function n(t, e, r) {
                var n = e.bind(r);
                r.elt.addEventListener(t, n, !1),
                r._events[t] = n
            }
            var i = t("./core");
            i.Element = function(t, e) {
                this.elt = t,
                this._pInst = e,
                this._events = {},
                this.width = this.elt.offsetWidth,
                this.height = this.elt.offsetHeight
            }
            ,
            i.Element.prototype.parent = function(t) {
                return 0 === arguments.length ? this.elt.parentNode : ("string" == typeof t ? ("#" === t[0] && (t = t.substring(1)),
                t = document.getElementById(t)) : t instanceof i.Element && (t = t.elt),
                t.appendChild(this.elt),
                this)
            }
            ,
            i.Element.prototype.id = function(t) {
                return 0 === arguments.length ? this.elt.id : (this.elt.id = t,
                this.width = this.elt.offsetWidth,
                this.height = this.elt.offsetHeight,
                this)
            }
            ,
            i.Element.prototype["class"] = function(t) {
                return 0 === arguments.length ? this.elt.className : (this.elt.className = t,
                this)
            }
            ,
            i.Element.prototype.mousePressed = function(t) {
                return n("mousedown", t, this),
                n("touchstart", t, this),
                this
            }
            ,
            i.Element.prototype.mouseWheel = function(t) {
                return n("wheel", t, this),
                this
            }
            ,
            i.Element.prototype.mouseReleased = function(t) {
                return n("mouseup", t, this),
                n("touchend", t, this),
                this
            }
            ,
            i.Element.prototype.mouseClicked = function(t) {
                return n("click", t, this),
                this
            }
            ,
            i.Element.prototype.mouseMoved = function(t) {
                return n("mousemove", t, this),
                n("touchmove", t, this),
                this
            }
            ,
            i.Element.prototype.mouseOver = function(t) {
                return n("mouseover", t, this),
                this
            }
            ,
            i.Element.prototype.changed = function(t) {
                return n("change", t, this),
                this
            }
            ,
            i.Element.prototype.input = function(t) {
                return n("input", t, this),
                this
            }
            ,
            i.Element.prototype.mouseOut = function(t) {
                return n("mouseout", t, this),
                this
            }
            ,
            i.Element.prototype.touchStarted = function(t) {
                return n("touchstart", t, this),
                n("mousedown", t, this),
                this
            }
            ,
            i.Element.prototype.touchMoved = function(t) {
                return n("touchmove", t, this),
                n("mousemove", t, this),
                this
            }
            ,
            i.Element.prototype.touchEnded = function(t) {
                return n("touchend", t, this),
                n("mouseup", t, this),
                this
            }
            ,
            i.Element.prototype.dragOver = function(t) {
                return n("dragover", t, this),
                this
            }
            ,
            i.Element.prototype.dragLeave = function(t) {
                return n("dragleave", t, this),
                this
            }
            ,
            i.Element.prototype.drop = function(t, e) {
                function r(e) {
                    var r = new i.File(e);
                    return function(e) {
                        r.data = e.target.result,
                        t(r)
                    }
                }
                return window.File && window.FileReader && window.FileList && window.Blob ? (n("dragover", function(t) {
                    t.stopPropagation(),
                    t.preventDefault()
                }, this),
                n("dragleave", function(t) {
                    t.stopPropagation(),
                    t.preventDefault()
                }, this),
                arguments.length > 1 && n("drop", e, this),
                n("drop", function(t) {
                    t.stopPropagation(),
                    t.preventDefault();
                    for (var e = t.dataTransfer.files, n = 0; n < e.length; n++) {
                        var i = e[n]
                          , o = new FileReader;
                        o.onload = r(i),
                        i.type.indexOf("text") > -1 ? o.readAsText(i) : o.readAsDataURL(i)
                    }
                }, this)) : console.log("The File APIs are not fully supported in this browser."),
                this
            }
            ,
            i.Element.prototype._setProperty = function(t, e) {
                this[t] = e
            }
            ,
            e.exports = i.Element
        }
        , {
            "./core": 37
        }],
        42: [function(t, e, r) {
            var n = t("./core")
              , i = t("./constants");
            n.Graphics = function(t, e, r, o) {
                var s = r || i.P2D
                  , a = document.createElement("canvas")
                  , h = this._userNode || document.body;
                h.appendChild(a),
                n.Element.call(this, a, o, !1),
                this._styles = [],
                this.width = t,
                this.height = e,
                this._pixelDensity = o._pixelDensity,
                s === i.WEBGL ? this._renderer = new n.RendererGL(a,this,!1) : this._renderer = new n.Renderer2D(a,this,!1),
                this._renderer.resize(t, e),
                this._renderer._applyDefaults(),
                o._elements.push(this);
                for (var u in n.prototype)
                    this[u] || ("function" == typeof n.prototype[u] ? this[u] = n.prototype[u].bind(this) : this[u] = n.prototype[u]);
                return this
            }
            ,
            n.Graphics.prototype = Object.create(n.Element.prototype),
            e.exports = n.Graphics
        }
        , {
            "./constants": 36,
            "./core": 37
        }],
        43: [function(t, e, r) {
            function n(t) {
                var e = 0
                  , r = 0;
                if (t.offsetParent) {
                    do
                        e += t.offsetLeft,
                        r += t.offsetTop;
                    while (t = t.offsetParent)
                } else
                    e += t.offsetLeft,
                    r += t.offsetTop;
                return [e, r]
            }
            var i = t("./core")
              , o = t("../core/constants");
            i.Renderer = function(t, e, r) {
                i.Element.call(this, t, e),
                this.canvas = t,
                this._pInst = e,
                r ? (this._isMainCanvas = !0,
                this._pInst._setProperty("_curElement", this),
                this._pInst._setProperty("canvas", this.canvas),
                this._pInst._setProperty("width", this.width),
                this._pInst._setProperty("height", this.height)) : (this.canvas.style.display = "none",
                this._styles = []),
                this._textSize = 12,
                this._textLeading = 15,
                this._textFont = "sans-serif",
                this._textStyle = o.NORMAL,
                this._textAscent = null,
                this._textDescent = null,
                this._rectMode = o.CORNER,
                this._ellipseMode = o.CENTER,
                this._curveTightness = 0,
                this._imageMode = o.CORNER,
                this._tint = null,
                this._doStroke = !0,
                this._doFill = !0,
                this._strokeSet = !1,
                this._fillSet = !1,
                this._colorMode = o.RGB,
                this._colorMaxes = {
                    rgb: [255, 255, 255, 255],
                    hsb: [360, 100, 100, 1],
                    hsl: [360, 100, 100, 1]
                }
            }
            ,
            i.Renderer.prototype = Object.create(i.Element.prototype),
            i.Renderer.prototype.resize = function(t, e) {
                this.width = t,
                this.height = e,
                this.elt.width = t * this._pInst._pixelDensity,
                this.elt.height = e * this._pInst._pixelDensity,
                this.elt.style.width = t + "px",
                this.elt.style.height = e + "px",
                this._isMainCanvas && (this._pInst._setProperty("width", this.width),
                this._pInst._setProperty("height", this.height))
            }
            ,
            i.Renderer.prototype.textLeading = function(t) {
                return arguments.length && arguments[0] ? (this._setProperty("_textLeading", t),
                this) : this._textLeading
            }
            ,
            i.Renderer.prototype.textSize = function(t) {
                return arguments.length && arguments[0] ? (this._setProperty("_textSize", t),
                this._setProperty("_textLeading", t * o._DEFAULT_LEADMULT),
                this._applyTextProperties()) : this._textSize
            }
            ,
            i.Renderer.prototype.textStyle = function(t) {
                return arguments.length && arguments[0] ? ((t === o.NORMAL || t === o.ITALIC || t === o.BOLD) && this._setProperty("_textStyle", t),
                this._applyTextProperties()) : this._textStyle
            }
            ,
            i.Renderer.prototype.textAscent = function() {
                return null === this._textAscent && this._updateTextMetrics(),
                this._textAscent
            }
            ,
            i.Renderer.prototype.textDescent = function() {
                return null === this._textDescent && this._updateTextMetrics(),
                this._textDescent
            }
            ,
            i.Renderer.prototype._applyDefaults = function() {
                return this
            }
            ,
            i.Renderer.prototype._isOpenType = function(t) {
                return t = t || this._textFont,
                "object" == typeof t && t.font && t.font.supported
            }
            ,
            i.Renderer.prototype._updateTextMetrics = function() {
                if (this._isOpenType())
                    return this._setProperty("_textAscent", this._textFont._textAscent()),
                    this._setProperty("_textDescent", this._textFont._textDescent()),
                    this;
                var t = document.createElement("span");
                t.style.fontFamily = this._textFont,
                t.style.fontSize = this._textSize + "px",
                t.innerHTML = "ABCjgq|";
                var e = document.createElement("div");
                e.style.display = "inline-block",
                e.style.width = "1px",
                e.style.height = "0px";
                var r = document.createElement("div");
                r.appendChild(t),
                r.appendChild(e),
                r.style.height = "0px",
                r.style.overflow = "hidden",
                document.body.appendChild(r),
                e.style.verticalAlign = "baseline";
                var i = n(e)
                  , o = n(t)
                  , s = i[1] - o[1];
                e.style.verticalAlign = "bottom",
                i = n(e),
                o = n(t);
                var a = i[1] - o[1]
                  , h = a - s;
                return document.body.removeChild(r),
                this._setProperty("_textAscent", s),
                this._setProperty("_textDescent", h),
                this
            }
            ,
            e.exports = i.Renderer
        }
        , {
            "../core/constants": 36,
            "./core": 37
        }],
        44: [function(t, e, r) {
            var n = t("./core")
              , i = t("./canvas")
              , o = t("./constants")
              , s = t("../image/filters");
            t("./p5.Renderer");
            var a = "rgba(0,0,0,0)";
            n.Renderer2D = function(t, e, r) {
                return n.Renderer.call(this, t, e, r),
                this.drawingContext = this.canvas.getContext("2d"),
                this._pInst._setProperty("drawingContext", this.drawingContext),
                this
            }
            ,
            n.Renderer2D.prototype = Object.create(n.Renderer.prototype),
            n.Renderer2D.prototype._applyDefaults = function() {
                this.drawingContext.fillStyle = o._DEFAULT_FILL,
                this.drawingContext.strokeStyle = o._DEFAULT_STROKE,
                this.drawingContext.lineCap = o.ROUND,
                this.drawingContext.font = "normal 12px sans-serif"
            }
            ,
            n.Renderer2D.prototype.resize = function(t, e) {
                n.Renderer.prototype.resize.call(this, t, e),
                this.drawingContext.scale(this._pInst._pixelDensity, this._pInst._pixelDensity)
            }
            ,
            n.Renderer2D.prototype.background = function() {
                if (this.drawingContext.save(),
                this.drawingContext.setTransform(1, 0, 0, 1, 0, 0),
                this.drawingContext.scale(this._pInst._pixelDensity, this._pInst._pixelDensity),
                arguments[0]instanceof n.Image)
                    this._pInst.image(arguments[0], 0, 0, this.width, this.height);
                else {
                    var t = this.drawingContext.fillStyle
                      , e = this._pInst.color.apply(this, arguments)
                      , r = e.toString();
                    this.drawingContext.fillStyle = r,
                    this.drawingContext.fillRect(0, 0, this.width, this.height),
                    this.drawingContext.fillStyle = t
                }
                this.drawingContext.restore()
            }
            ,
            n.Renderer2D.prototype.clear = function() {
                this.drawingContext.clearRect(0, 0, this.width, this.height)
            }
            ,
            n.Renderer2D.prototype.fill = function() {
                var t = this.drawingContext
                  , e = this._pInst.color.apply(this, arguments);
                t.fillStyle = e.toString()
            }
            ,
            n.Renderer2D.prototype.stroke = function() {
                var t = this.drawingContext
                  , e = this._pInst.color.apply(this, arguments);
                t.strokeStyle = e.toString()
            }
            ,
            n.Renderer2D.prototype.image = function(t, e, r, i, o, s, a, h, u) {
                var l;
                try {
                    this._tint && (n.MediaElement && t instanceof n.MediaElement && t.loadPixels(),
                    t.canvas && (l = this._getTintedImageCanvas(t))),
                    l || (l = t.canvas || t.elt),
                    this.drawingContext.drawImage(l, e, r, i, o, s, a, h, u)
                } catch (p) {
                    if ("NS_ERROR_NOT_AVAILABLE" !== p.name)
                        throw p
                }
            }
            ,
            n.Renderer2D.prototype._getTintedImageCanvas = function(t) {
                if (!t.canvas)
                    return t;
                var e = s._toPixels(t.canvas)
                  , r = document.createElement("canvas");
                r.width = t.canvas.width,
                r.height = t.canvas.height;
                for (var n = r.getContext("2d"), i = n.createImageData(t.canvas.width, t.canvas.height), o = i.data, a = 0; a < e.length; a += 4) {
                    var h = e[a]
                      , u = e[a + 1]
                      , l = e[a + 2]
                      , p = e[a + 3];
                    o[a] = h * this._tint[0] / 255,
                    o[a + 1] = u * this._tint[1] / 255,
                    o[a + 2] = l * this._tint[2] / 255,
                    o[a + 3] = p * this._tint[3] / 255
                }
                return n.putImageData(i, 0, 0),
                r
            }
            ,
            n.Renderer2D.prototype.blendMode = function(t) {
                this.drawingContext.globalCompositeOperation = t
            }
            ,
            n.Renderer2D.prototype.blend = function() {
                var t = this.drawingContext.globalCompositeOperation
                  , e = arguments[arguments.length - 1]
                  , r = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
                this.drawingContext.globalCompositeOperation = e,
                this._pInst ? this._pInst.copy.apply(this._pInst, r) : this.copy.apply(this, r),
                this.drawingContext.globalCompositeOperation = t
            }
            ,
            n.Renderer2D.prototype.copy = function() {
                var t, e, r, i, o, s, a, h, u;
                if (9 === arguments.length)
                    t = arguments[0],
                    e = arguments[1],
                    r = arguments[2],
                    i = arguments[3],
                    o = arguments[4],
                    s = arguments[5],
                    a = arguments[6],
                    h = arguments[7],
                    u = arguments[8];
                else {
                    if (8 !== arguments.length)
                        throw new Error("Signature not supported");
                    t = this._pInst,
                    e = arguments[0],
                    r = arguments[1],
                    i = arguments[2],
                    o = arguments[3],
                    s = arguments[4],
                    a = arguments[5],
                    h = arguments[6],
                    u = arguments[7]
                }
                n.Renderer2D._copyHelper(t, e, r, i, o, s, a, h, u)
            }
            ,
            n.Renderer2D._copyHelper = function(t, e, r, n, i, o, s, a, h) {
                var u = t.canvas.width / t.width;
                this.drawingContext.drawImage(t.canvas, u * e, u * r, u * n, u * i, o, s, a, h)
            }
            ,
            n.Renderer2D.prototype.get = function(t, e, r, i) {
                if (void 0 === t && void 0 === e && void 0 === r && void 0 === i ? (t = 0,
                e = 0,
                r = this.width,
                i = this.height) : void 0 === r && void 0 === i && (r = 1,
                i = 1),
                0 > t + r || 0 > e + i || t > this.width || e > this.height)
                    return [0, 0, 0, 255];
                var o = this._pInst || this
                  , s = o._pixelDensity;
                if (o.loadPixels(),
                t = Math.floor(t),
                e = Math.floor(e),
                1 === r && 1 === i) {
                    var a = s * s * 4 * (e * this.width + t);
                    return [o.pixels[a], o.pixels[a + 1], o.pixels[a + 2], o.pixels[a + 3]]
                }
                var h = t * s
                  , u = e * s
                  , l = Math.min(r, o.width)
                  , p = Math.min(i, o.height)
                  , c = l * s
                  , d = p * s
                  , f = new n.Image(l,p);
                return f.canvas.getContext("2d").drawImage(this.canvas, h, u, c, d, 0, 0, l, p),
                f
            }
            ,
            n.Renderer2D.prototype.loadPixels = function() {
                var t = this._pixelDensity || this._pInst._pixelDensity
                  , e = this.width * t
                  , r = this.height * t
                  , n = this.drawingContext.getImageData(0, 0, e, r);
                this._pInst ? (this._pInst._setProperty("imageData", n),
                this._pInst._setProperty("pixels", n.data)) : (this._setProperty("imageData", n),
                this._setProperty("pixels", n.data))
            }
            ,
            n.Renderer2D.prototype.set = function(t, e, r) {
                if (t = Math.floor(t),
                e = Math.floor(e),
                r instanceof n.Image)
                    this.drawingContext.save(),
                    this.drawingContext.setTransform(1, 0, 0, 1, 0, 0),
                    this.drawingContext.scale(this._pInst._pixelDensity, this._pInst._pixelDensity),
                    this.drawingContext.drawImage(r.canvas, t, e),
                    this.loadPixels.call(this._pInst),
                    this.drawingContext.restore();
                else {
                    var i = this._pInst || this
                      , o = 0
                      , s = 0
                      , a = 0
                      , h = 0
                      , u = 4 * (e * i._pixelDensity * this.width * i._pixelDensity + t * i._pixelDensity);
                    if (i.imageData || i.loadPixels.call(i),
                    "number" == typeof r)
                        u < i.pixels.length && (o = r,
                        s = r,
                        a = r,
                        h = 255);
                    else if (r instanceof Array) {
                        if (r.length < 4)
                            throw new Error("pixel array must be of the form [R, G, B, A]");
                        u < i.pixels.length && (o = r[0],
                        s = r[1],
                        a = r[2],
                        h = r[3])
                    } else
                        r instanceof n.Color && u < i.pixels.length && (o = r.levels[0],
                        s = r.levels[1],
                        a = r.levels[2],
                        h = r.levels[3]);
                    for (var l = 0; l < i._pixelDensity; l++)
                        for (var p = 0; p < i._pixelDensity; p++)
                            u = 4 * ((e * i._pixelDensity + p) * this.width * i._pixelDensity + (t * i._pixelDensity + l)),
                            i.pixels[u] = o,
                            i.pixels[u + 1] = s,
                            i.pixels[u + 2] = a,
                            i.pixels[u + 3] = h
                }
            }
            ,
            n.Renderer2D.prototype.updatePixels = function(t, e, r, n) {
                var i = this._pixelDensity || this._pInst._pixelDensity;
                void 0 === t && void 0 === e && void 0 === r && void 0 === n && (t = 0,
                e = 0,
                r = this.width,
                n = this.height),
                r *= i,
                n *= i,
                this._pInst ? this.drawingContext.putImageData(this._pInst.imageData, t, e, 0, 0, r, n) : this.drawingContext.putImageData(this.imageData, t, e, 0, 0, r, n)
            }
            ,
            n.Renderer2D.prototype._acuteArcToBezier = function(t, e) {
                var r = e / 2
                  , n = Math.cos(r)
                  , i = Math.sin(r)
                  , o = 1 / Math.tan(r)
                  , s = t + r
                  , a = Math.cos(s)
                  , h = Math.sin(s)
                  , u = (4 - n) / 3
                  , l = i + (n - u) * o;
                return {
                    ax: Math.cos(t),
                    ay: Math.sin(t),
                    bx: u * a + l * h,
                    by: u * h - l * a,
                    cx: u * a - l * h,
                    cy: u * h + l * a,
                    dx: Math.cos(t + e),
                    dy: Math.sin(t + e)
                }
            }
            ,
            n.Renderer2D.prototype.arc = function(t, e, r, n, s, a, h) {
                for (var u = this.drawingContext, l = i.arcModeAdjust(t, e, r, n, this._ellipseMode), p = l.w / 2, c = l.h / 2, d = 1e-5, f = 0, m = []; a - s > d; )
                    f = Math.min(a - s, o.HALF_PI),
                    m.push(this._acuteArcToBezier(s, f)),
                    s += f;
                return this._doFill && (u.beginPath(),
                m.forEach(function(t, e) {
                    0 === e && u.moveTo(l.x + t.ax * p, l.y + t.ay * c),
                    u.bezierCurveTo(l.x + t.bx * p, l.y + t.by * c, l.x + t.cx * p, l.y + t.cy * c, l.x + t.dx * p, l.y + t.dy * c)
                }),
                (h === o.PIE || null == h) && u.lineTo(l.x, l.y),
                u.closePath(),
                u.fill()),
                this._doStroke && (u.beginPath(),
                m.forEach(function(t, e) {
                    0 === e && u.moveTo(l.x + t.ax * p, l.y + t.ay * c),
                    u.bezierCurveTo(l.x + t.bx * p, l.y + t.by * c, l.x + t.cx * p, l.y + t.cy * c, l.x + t.dx * p, l.y + t.dy * c)
                }),
                h === o.PIE ? (u.lineTo(l.x, l.y),
                u.closePath()) : h === o.CHORD && u.closePath(),
                u.stroke()),
                this
            }
            ,
            n.Renderer2D.prototype.ellipse = function(t, e, r, n) {
                var o = this.drawingContext
                  , s = this._doFill
                  , h = this._doStroke;
                if (s && !h) {
                    if (o.fillStyle === a)
                        return this
                } else if (!s && h && o.strokeStyle === a)
                    return this;
                var u = i.modeAdjust(t, e, r, n, this._ellipseMode)
                  , l = .5522847498
                  , p = u.w / 2 * l
                  , c = u.h / 2 * l
                  , d = u.x + u.w
                  , f = u.y + u.h
                  , m = u.x + u.w / 2
                  , y = u.y + u.h / 2;
                o.beginPath(),
                o.moveTo(u.x, y),
                o.bezierCurveTo(u.x, y - c, m - p, u.y, m, u.y),
                o.bezierCurveTo(m + p, u.y, d, y - c, d, y),
                o.bezierCurveTo(d, y + c, m + p, f, m, f),
                o.bezierCurveTo(m - p, f, u.x, y + c, u.x, y),
                o.closePath(),
                s && o.fill(),
                h && o.stroke()
            }
            ,
            n.Renderer2D.prototype.line = function(t, e, r, n) {
                var i = this.drawingContext;
                return this._doStroke ? i.strokeStyle === a ? this : (i.lineWidth % 2 === 1 && i.translate(.5, .5),
                i.beginPath(),
                i.moveTo(t, e),
                i.lineTo(r, n),
                i.stroke(),
                i.lineWidth % 2 === 1 && i.translate(-.5, -.5),
                this) : this
            }
            ,
            n.Renderer2D.prototype.point = function(t, e) {
                var r = this.drawingContext
                  , n = r.strokeStyle
                  , i = r.fillStyle;
                return this._doStroke ? r.strokeStyle === a ? this : (t = Math.round(t),
                e = Math.round(e),
                r.fillStyle = n,
                r.lineWidth > 1 ? (r.beginPath(),
                r.arc(t, e, r.lineWidth / 2, 0, o.TWO_PI, !1),
                r.fill()) : r.fillRect(t, e, 1, 1),
                void (r.fillStyle = i)) : this
            }
            ,
            n.Renderer2D.prototype.quad = function(t, e, r, n, i, o, s, h) {
                var u = this.drawingContext
                  , l = this._doFill
                  , p = this._doStroke;
                if (l && !p) {
                    if (u.fillStyle === a)
                        return this
                } else if (!l && p && u.strokeStyle === a)
                    return this;
                return u.beginPath(),
                u.moveTo(t, e),
                u.lineTo(r, n),
                u.lineTo(i, o),
                u.lineTo(s, h),
                u.closePath(),
                l && u.fill(),
                p && u.stroke(),
                this
            }
            ,
            n.Renderer2D.prototype.rect = function(t) {
                var e = t[0]
                  , r = t[1]
                  , n = t[2]
                  , o = t[3]
                  , s = t[4]
                  , h = t[5]
                  , u = t[6]
                  , l = t[7]
                  , p = this.drawingContext
                  , c = this._doFill
                  , d = this._doStroke;
                if (c && !d) {
                    if (p.fillStyle === a)
                        return this
                } else if (!c && d && p.strokeStyle === a)
                    return this;
                var f = i.modeAdjust(e, r, n, o, this._rectMode);
                if (this._doStroke && p.lineWidth % 2 === 1 && p.translate(.5, .5),
                p.beginPath(),
                "undefined" == typeof s)
                    p.rect(f.x, f.y, f.w, f.h);
                else {
                    "undefined" == typeof h && (h = s),
                    "undefined" == typeof u && (u = h),
                    "undefined" == typeof l && (l = u);
                    var m = f.x
                      , y = f.y
                      , g = f.w
                      , v = f.h
                      , _ = g / 2
                      , x = v / 2;
                    2 * s > g && (s = _),
                    2 * s > v && (s = x),
                    2 * h > g && (h = _),
                    2 * h > v && (h = x),
                    2 * u > g && (u = _),
                    2 * u > v && (u = x),
                    2 * l > g && (l = _),
                    2 * l > v && (l = x),
                    p.beginPath(),
                    p.moveTo(m + s, y),
                    p.arcTo(m + g, y, m + g, y + v, h),
                    p.arcTo(m + g, y + v, m, y + v, u),
                    p.arcTo(m, y + v, m, y, l),
                    p.arcTo(m, y, m + g, y, s),
                    p.closePath()
                }
                return this._doFill && p.fill(),
                this._doStroke && p.stroke(),
                this._doStroke && p.lineWidth % 2 === 1 && p.translate(-.5, -.5),
                this
            }
            ,
            n.Renderer2D.prototype.triangle = function(t, e, r, n, i, o) {
                var s = this.drawingContext
                  , h = this._doFill
                  , u = this._doStroke;
                if (h && !u) {
                    if (s.fillStyle === a)
                        return this
                } else if (!h && u && s.strokeStyle === a)
                    return this;
                s.beginPath(),
                s.moveTo(t, e),
                s.lineTo(r, n),
                s.lineTo(i, o),
                s.closePath(),
                h && s.fill(),
                u && s.stroke()
            }
            ,
            n.Renderer2D.prototype.endShape = function(t, e, r, n, i, s, a) {
                if (0 === e.length)
                    return this;
                if (!this._doStroke && !this._doFill)
                    return this;
                var h, u = t === o.CLOSE;
                u && !s && e.push(e[0]);
                var l, p, c = e.length;
                if (!r || a !== o.POLYGON && null !== a)
                    if (!n || a !== o.POLYGON && null !== a)
                        if (!i || a !== o.POLYGON && null !== a)
                            if (a === o.POINTS)
                                for (l = 0; c > l; l++)
                                    h = e[l],
                                    this._doStroke && this._pInst.stroke(h[6]),
                                    this._pInst.point(h[0], h[1]);
                            else if (a === o.LINES)
                                for (l = 0; c > l + 1; l += 2)
                                    h = e[l],
                                    this._doStroke && this._pInst.stroke(e[l + 1][6]),
                                    this._pInst.line(h[0], h[1], e[l + 1][0], e[l + 1][1]);
                            else if (a === o.TRIANGLES)
                                for (l = 0; c > l + 2; l += 3)
                                    h = e[l],
                                    this.drawingContext.beginPath(),
                                    this.drawingContext.moveTo(h[0], h[1]),
                                    this.drawingContext.lineTo(e[l + 1][0], e[l + 1][1]),
                                    this.drawingContext.lineTo(e[l + 2][0], e[l + 2][1]),
                                    this.drawingContext.lineTo(h[0], h[1]),
                                    this._doFill && (this._pInst.fill(e[l + 2][5]),
                                    this.drawingContext.fill()),
                                    this._doStroke && (this._pInst.stroke(e[l + 2][6]),
                                    this.drawingContext.stroke()),
                                    this.drawingContext.closePath();
                            else if (a === o.TRIANGLE_STRIP)
                                for (l = 0; c > l + 1; l++)
                                    h = e[l],
                                    this.drawingContext.beginPath(),
                                    this.drawingContext.moveTo(e[l + 1][0], e[l + 1][1]),
                                    this.drawingContext.lineTo(h[0], h[1]),
                                    this._doStroke && this._pInst.stroke(e[l + 1][6]),
                                    this._doFill && this._pInst.fill(e[l + 1][5]),
                                    c > l + 2 && (this.drawingContext.lineTo(e[l + 2][0], e[l + 2][1]),
                                    this._doStroke && this._pInst.stroke(e[l + 2][6]),
                                    this._doFill && this._pInst.fill(e[l + 2][5])),
                                    this._doFillStrokeClose();
                            else if (a === o.TRIANGLE_FAN) {
                                if (c > 2)
                                    for (this.drawingContext.beginPath(),
                                    this.drawingContext.moveTo(e[0][0], e[0][1]),
                                    this.drawingContext.lineTo(e[1][0], e[1][1]),
                                    this.drawingContext.lineTo(e[2][0], e[2][1]),
                                    this._doFill && this._pInst.fill(e[2][5]),
                                    this._doStroke && this._pInst.stroke(e[2][6]),
                                    this._doFillStrokeClose(),
                                    l = 3; c > l; l++)
                                        h = e[l],
                                        this.drawingContext.beginPath(),
                                        this.drawingContext.moveTo(e[0][0], e[0][1]),
                                        this.drawingContext.lineTo(e[l - 1][0], e[l - 1][1]),
                                        this.drawingContext.lineTo(h[0], h[1]),
                                        this._doFill && this._pInst.fill(h[5]),
                                        this._doStroke && this._pInst.stroke(h[6]),
                                        this._doFillStrokeClose()
                            } else if (a === o.QUADS)
                                for (l = 0; c > l + 3; l += 4) {
                                    for (h = e[l],
                                    this.drawingContext.beginPath(),
                                    this.drawingContext.moveTo(h[0], h[1]),
                                    p = 1; 4 > p; p++)
                                        this.drawingContext.lineTo(e[l + p][0], e[l + p][1]);
                                    this.drawingContext.lineTo(h[0], h[1]),
                                    this._doFill && this._pInst.fill(e[l + 3][5]),
                                    this._doStroke && this._pInst.stroke(e[l + 3][6]),
                                    this._doFillStrokeClose()
                                }
                            else if (a === o.QUAD_STRIP) {
                                if (c > 3)
                                    for (l = 0; c > l + 1; l += 2)
                                        h = e[l],
                                        this.drawingContext.beginPath(),
                                        c > l + 3 ? (this.drawingContext.moveTo(e[l + 2][0], e[l + 2][1]),
                                        this.drawingContext.lineTo(h[0], h[1]),
                                        this.drawingContext.lineTo(e[l + 1][0], e[l + 1][1]),
                                        this.drawingContext.lineTo(e[l + 3][0], e[l + 3][1]),
                                        this._doFill && this._pInst.fill(e[l + 3][5]),
                                        this._doStroke && this._pInst.stroke(e[l + 3][6])) : (this.drawingContext.moveTo(h[0], h[1]),
                                        this.drawingContext.lineTo(e[l + 1][0], e[l + 1][1])),
                                        this._doFillStrokeClose()
                            } else {
                                for (this.drawingContext.beginPath(),
                                this.drawingContext.moveTo(e[0][0], e[0][1]),
                                l = 1; c > l; l++)
                                    h = e[l],
                                    h.isVert && (h.moveTo ? this.drawingContext.moveTo(h[0], h[1]) : this.drawingContext.lineTo(h[0], h[1]));
                                this._doFillStrokeClose()
                            }
                        else {
                            for (this.drawingContext.beginPath(),
                            l = 0; c > l; l++)
                                e[l].isVert ? e[l].moveTo ? this.drawingContext.moveTo([0], e[l][1]) : this.drawingContext.lineTo(e[l][0], e[l][1]) : this.drawingContext.quadraticCurveTo(e[l][0], e[l][1], e[l][2], e[l][3]);
                            this._doFillStrokeClose()
                        }
                    else {
                        for (this.drawingContext.beginPath(),
                        l = 0; c > l; l++)
                            e[l].isVert ? e[l].moveTo ? this.drawingContext.moveTo(e[l][0], e[l][1]) : this.drawingContext.lineTo(e[l][0], e[l][1]) : this.drawingContext.bezierCurveTo(e[l][0], e[l][1], e[l][2], e[l][3], e[l][4], e[l][5]);
                        this._doFillStrokeClose()
                    }
                else if (c > 3) {
                    var d = []
                      , f = 1 - this._curveTightness;
                    for (this.drawingContext.beginPath(),
                    this.drawingContext.moveTo(e[1][0], e[1][1]),
                    l = 1; c > l + 2; l++)
                        h = e[l],
                        d[0] = [h[0], h[1]],
                        d[1] = [h[0] + (f * e[l + 1][0] - f * e[l - 1][0]) / 6, h[1] + (f * e[l + 1][1] - f * e[l - 1][1]) / 6],
                        d[2] = [e[l + 1][0] + (f * e[l][0] - f * e[l + 2][0]) / 6, e[l + 1][1] + (f * e[l][1] - f * e[l + 2][1]) / 6],
                        d[3] = [e[l + 1][0], e[l + 1][1]],
                        this.drawingContext.bezierCurveTo(d[1][0], d[1][1], d[2][0], d[2][1], d[3][0], d[3][1]);
                    u && this.drawingContext.lineTo(e[l + 1][0], e[l + 1][1]),
                    this._doFillStrokeClose()
                }
                return r = !1,
                n = !1,
                i = !1,
                s = !1,
                u && e.pop(),
                this
            }
            ,
            n.Renderer2D.prototype.noSmooth = function() {
                return "imageSmoothingEnabled"in this.drawingContext ? this.drawingContext.imageSmoothingEnabled = !1 : "mozImageSmoothingEnabled"in this.drawingContext ? this.drawingContext.mozImageSmoothingEnabled = !1 : "webkitImageSmoothingEnabled"in this.drawingContext ? this.drawingContext.webkitImageSmoothingEnabled = !1 : "msImageSmoothingEnabled"in this.drawingContext && (this.drawingContext.msImageSmoothingEnabled = !1),
                this
            }
            ,
            n.Renderer2D.prototype.smooth = function() {
                return "imageSmoothingEnabled"in this.drawingContext ? this.drawingContext.imageSmoothingEnabled = !0 : "mozImageSmoothingEnabled"in this.drawingContext ? this.drawingContext.mozImageSmoothingEnabled = !0 : "webkitImageSmoothingEnabled"in this.drawingContext ? this.drawingContext.webkitImageSmoothingEnabled = !0 : "msImageSmoothingEnabled"in this.drawingContext && (this.drawingContext.msImageSmoothingEnabled = !0),
                this
            }
            ,
            n.Renderer2D.prototype.strokeCap = function(t) {
                return (t === o.ROUND || t === o.SQUARE || t === o.PROJECT) && (this.drawingContext.lineCap = t),
                this
            }
            ,
            n.Renderer2D.prototype.strokeJoin = function(t) {
                return (t === o.ROUND || t === o.BEVEL || t === o.MITER) && (this.drawingContext.lineJoin = t),
                this
            }
            ,
            n.Renderer2D.prototype.strokeWeight = function(t) {
                return "undefined" == typeof t || 0 === t ? this.drawingContext.lineWidth = 1e-4 : this.drawingContext.lineWidth = t,
                this
            }
            ,
            n.Renderer2D.prototype._getFill = function() {
                return this.drawingContext.fillStyle
            }
            ,
            n.Renderer2D.prototype._getStroke = function() {
                return this.drawingContext.strokeStyle
            }
            ,
            n.Renderer2D.prototype.bezier = function(t, e, r, n, i, o, s, a) {
                return this._pInst.beginShape(),
                this._pInst.vertex(t, e),
                this._pInst.bezierVertex(r, n, i, o, s, a),
                this._pInst.endShape(),
                this
            }
            ,
            n.Renderer2D.prototype.curve = function(t, e, r, n, i, o, s, a) {
                return this._pInst.beginShape(),
                this._pInst.curveVertex(t, e),
                this._pInst.curveVertex(r, n),
                this._pInst.curveVertex(i, o),
                this._pInst.curveVertex(s, a),
                this._pInst.endShape(),
                this
            }
            ,
            n.Renderer2D.prototype._doFillStrokeClose = function() {
                this._doFill && this.drawingContext.fill(),
                this._doStroke && this.drawingContext.stroke(),
                this.drawingContext.closePath()
            }
            ,
            n.Renderer2D.prototype.applyMatrix = function(t, e, r, n, i, o) {
                this.drawingContext.transform(t, e, r, n, i, o)
            }
            ,
            n.Renderer2D.prototype.resetMatrix = function() {
                return this.drawingContext.setTransform(1, 0, 0, 1, 0, 0),
                this.drawingContext.scale(this._pInst._pixelDensity, this._pInst._pixelDensity),
                this
            }
            ,
            n.Renderer2D.prototype.rotate = function(t) {
                this.drawingContext.rotate(t)
            }
            ,
            n.Renderer2D.prototype.scale = function(t, e) {
                return this.drawingContext.scale(t, e),
                this
            }
            ,
            n.Renderer2D.prototype.shearX = function(t) {
                return this._pInst._angleMode === o.DEGREES && (t = this._pInst.degrees(t)),
                this.drawingContext.transform(1, 0, this._pInst.tan(t), 1, 0, 0),
                this
            }
            ,
            n.Renderer2D.prototype.shearY = function(t) {
                return this._pInst._angleMode === o.DEGREES && (t = this._pInst.degrees(t)),
                this.drawingContext.transform(1, this._pInst.tan(t), 0, 1, 0, 0),
                this
            }
            ,
            n.Renderer2D.prototype.translate = function(t, e) {
                return this.drawingContext.translate(t, e),
                this
            }
            ,
            n.Renderer2D.prototype.text = function(t, e, r, n, i) {
                var s, a, h, u, l, p, c, d, f, m, y = this._pInst, g = Number.MAX_VALUE;
                if (this._doFill || this._doStroke) {
                    if ("string" != typeof t && (t = t.toString()),
                    t = t.replace(/(\t)/g, "  "),
                    s = t.split("\n"),
                    "undefined" != typeof n) {
                        for (f = 0,
                        h = 0; h < s.length; h++)
                            for (l = "",
                            d = s[h].split(" "),
                            a = 0; a < d.length; a++)
                                p = l + d[a] + " ",
                                c = this.textWidth(p),
                                c > n ? (l = d[a] + " ",
                                f += y.textLeading()) : l = p;
                        switch (this._rectMode === o.CENTER && (e -= n / 2,
                        r -= i / 2),
                        this.drawingContext.textAlign) {
                        case o.CENTER:
                            e += n / 2;
                            break;
                        case o.RIGHT:
                            e += n
                        }
                        if ("undefined" != typeof i) {
                            switch (this.drawingContext.textBaseline) {
                            case o.BOTTOM:
                                r += i - f;
                                break;
                            case o._CTX_MIDDLE:
                                r += (i - f) / 2;
                                break;
                            case o.BASELINE:
                                m = !0,
                                this.drawingContext.textBaseline = o.TOP
                            }
                            g = r + i - y.textAscent()
                        }
                        for (h = 0; h < s.length; h++) {
                            for (l = "",
                            d = s[h].split(" "),
                            a = 0; a < d.length; a++)
                                p = l + d[a] + " ",
                                c = this.textWidth(p),
                                c > n && l.length > 0 ? (this._renderText(y, l, e, r, g),
                                l = d[a] + " ",
                                r += y.textLeading()) : l = p;
                            this._renderText(y, l, e, r, g),
                            r += y.textLeading()
                        }
                    } else {
                        var v = 0
                          , _ = y.textAlign().vertical;
                        for (_ === o.CENTER ? v = (s.length - 1) * y.textLeading() / 2 : _ === o.BOTTOM && (v = (s.length - 1) * y.textLeading()),
                        u = 0; u < s.length; u++)
                            this._renderText(y, s[u], e, r - v, g),
                            r += y.textLeading()
                    }
                    return m && (this.drawingContext.textBaseline = o.BASELINE),
                    y
                }
            }
            ,
            n.Renderer2D.prototype._renderText = function(t, e, r, n, i) {
                return n >= i ? void 0 : (t.push(),
                this._isOpenType() ? this._textFont._renderPath(e, r, n, {
                    renderer: this
                }) : (this._doStroke && this._strokeSet && this.drawingContext.strokeText(e, r, n),
                this._doFill && (this.drawingContext.fillStyle = this._fillSet ? this.drawingContext.fillStyle : o._DEFAULT_TEXT_FILL,
                this.drawingContext.fillText(e, r, n))),
                t.pop(),
                t)
            }
            ,
            n.Renderer2D.prototype.textWidth = function(t) {
                return this._isOpenType() ? this._textFont._textWidth(t, this._textSize) : this.drawingContext.measureText(t).width
            }
            ,
            n.Renderer2D.prototype.textAlign = function(t, e) {
                if (arguments.length)
                    return (t === o.LEFT || t === o.RIGHT || t === o.CENTER) && (this.drawingContext.textAlign = t),
                    (e === o.TOP || e === o.BOTTOM || e === o.CENTER || e === o.BASELINE) && (e === o.CENTER ? this.drawingContext.textBaseline = o._CTX_MIDDLE : this.drawingContext.textBaseline = e),
                    this._pInst;
                var r = this.drawingContext.textBaseline;
                return r === o._CTX_MIDDLE && (r = o.CENTER),
                {
                    horizontal: this.drawingContext.textAlign,
                    vertical: r
                }
            }
            ,
            n.Renderer2D.prototype._applyTextProperties = function() {
                var t, e = this._pInst;
                return this._setProperty("_textAscent", null),
                this._setProperty("_textDescent", null),
                t = this._textFont,
                this._isOpenType() && (t = this._textFont.font.familyName,
                this._setProperty("_textStyle", this._textFont.font.styleName)),
                this.drawingContext.font = this._textStyle + " " + this._textSize + "px " + t,
                e
            }
            ,
            n.Renderer2D.prototype.push = function() {
                this.drawingContext.save()
            }
            ,
            n.Renderer2D.prototype.pop = function() {
                this.drawingContext.restore()
            }
            ,
            e.exports = n.Renderer2D
        }
        , {
            "../image/filters": 54,
            "./canvas": 35,
            "./constants": 36,
            "./core": 37,
            "./p5.Renderer": 43
        }],
        45: [function(t, e, r) {
            var n = t("./core")
              , i = t("./constants");
            t("./p5.Graphics"),
            t("./p5.Renderer2D"),
            t("../webgl/p5.RendererGL");
            var o = "defaultCanvas0";
            n.prototype.createCanvas = function(t, e, r) {
                var s, a, h = r || i.P2D;
                if (arguments[3] && (s = "boolean" == typeof arguments[3] ? arguments[3] : !1),
                h === i.WEBGL)
                    a = document.getElementById(o),
                    a && a.parentNode.removeChild(a),
                    a = document.createElement("canvas"),
                    a.id = o;
                else if (s) {
                    a = document.createElement("canvas");
                    for (var u = 0; document.getElementById("defaultCanvas" + u); )
                        u++;
                    o = "defaultCanvas" + u,
                    a.id = o
                } else
                    a = this.canvas;
                return this._setupDone || (a.dataset.hidden = !0,
                a.style.visibility = "hidden"),
                this._userNode ? this._userNode.appendChild(a) : document.body.appendChild(a),
                h === i.WEBGL ? (this._setProperty("_renderer", new n.RendererGL(a,this,!0)),
                this._isdefaultGraphics = !0) : this._isdefaultGraphics || (this._setProperty("_renderer", new n.Renderer2D(a,this,!0)),
                this._isdefaultGraphics = !0),
                this._renderer.resize(t, e),
                this._renderer._applyDefaults(),
                s && this._elements.push(this._renderer),
                this._renderer
            }
            ,
            n.prototype.resizeCanvas = function(t, e, r) {
                if (this._renderer) {
                    var n = {};
                    for (var i in this.drawingContext) {
                        var o = this.drawingContext[i];
                        "object" != typeof o && "function" != typeof o && (n[i] = o)
                    }
                    this._renderer.resize(t, e);
                    for (var s in n)
                        this.drawingContext[s] = n[s];
                    r || this.redraw()
                }
            }
            ,
            n.prototype.noCanvas = function() {
                this.canvas && this.canvas.parentNode.removeChild(this.canvas)
            }
            ,
            n.prototype.createGraphics = function(t, e, r) {
                return new n.Graphics(t,e,r,this)
            }
            ,
            n.prototype.blendMode = function(t) {
                if (t !== i.BLEND && t !== i.DARKEST && t !== i.LIGHTEST && t !== i.DIFFERENCE && t !== i.MULTIPLY && t !== i.EXCLUSION && t !== i.SCREEN && t !== i.REPLACE && t !== i.OVERLAY && t !== i.HARD_LIGHT && t !== i.SOFT_LIGHT && t !== i.DODGE && t !== i.BURN && t !== i.ADD && t !== i.NORMAL)
                    throw new Error("Mode " + t + " not recognized.");
                this._renderer.blendMode(t)
            }
            ,
            e.exports = n
        }
        , {
            "../webgl/p5.RendererGL": 86,
            "./constants": 36,
            "./core": 37,
            "./p5.Graphics": 42,
            "./p5.Renderer2D": 44
        }],
        46: [function(t, e, r) {
            window.requestAnimationFrame = function() {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t, e) {
                    window.setTimeout(t, 1e3 / 60)
                }
            }(),
            window.performance = window.performance || {},
            window.performance.now = function() {
                var t = Date.now();
                return window.performance.now || window.performance.mozNow || window.performance.msNow || window.performance.oNow || window.performance.webkitNow || function() {
                    return Date.now() - t
                }
            }(),
            function() {
                "use strict";
                "undefined" == typeof Uint8ClampedArray || Uint8ClampedArray.prototype.slice || Object.defineProperty(Uint8ClampedArray.prototype, "slice", {
                    value: Array.prototype.slice,
                    writable: !0,
                    configurable: !0,
                    enumerable: !1
                })
            }()
        }
        , {}],
        47: [function(t, e, r) {
            "use strict";
            var n = t("./core");
            n.prototype.exit = function() {
                throw "exit() not implemented, see remove()"
            }
            ,
            n.prototype.noLoop = function() {
                this._loop = !1
            }
            ,
            n.prototype.loop = function() {
                this._loop = !0,
                this._draw()
            }
            ,
            n.prototype.push = function() {
                this._renderer.push(),
                this._styles.push({
                    _doStroke: this._renderer._doStroke,
                    _strokeSet: this._renderer._strokeSet,
                    _doFill: this._renderer._doFill,
                    _fillSet: this._renderer._fillSet,
                    _tint: this._renderer._tint,
                    _imageMode: this._renderer._imageMode,
                    _rectMode: this._renderer._rectMode,
                    _ellipseMode: this._renderer._ellipseMode,
                    _colorMode: this._renderer._colorMode,
                    _textFont: this._renderer._textFont,
                    _textLeading: this._renderer._textLeading,
                    _textSize: this._renderer._textSize,
                    _textStyle: this._renderer._textStyle
                })
            }
            ,
            n.prototype.pop = function() {
                this._renderer.pop();
                var t = this._styles.pop();
                for (var e in t)
                    this._renderer[e] = t[e]
            }
            ,
            n.prototype.pushStyle = function() {
                throw new Error("pushStyle() not used, see push()")
            }
            ,
            n.prototype.popStyle = function() {
                throw new Error("popStyle() not used, see pop()")
            }
            ,
            n.prototype.redraw = function() {
                var t = this.setup || window.setup
                  , e = this.draw || window.draw;
                if ("function" == typeof e) {
                    "undefined" == typeof t && this.scale(this._pixelDensity, this._pixelDensity);
                    var r = this;
                    this._registeredMethods.pre.forEach(function(t) {
                        t.call(r)
                    }),
                    e(),
                    this._registeredMethods.post.forEach(function(t) {
                        t.call(r)
                    })
                }
            }
            ,
            n.prototype.size = function() {
                var t = "size() is not a valid p5 function, to set the size of the ";
                throw t += "drawing canvas, please use createCanvas() instead"
            }
            ,
            e.exports = n
        }
        , {
            "./core": 37
        }],
        48: [function(t, e, r) {
            "use strict";
            var n = t("./core")
              , i = t("./constants");
            n.prototype.applyMatrix = function(t, e, r, n, i, o) {
                return this._renderer.applyMatrix(t, e, r, n, i, o),
                this
            }
            ,
            n.prototype.popMatrix = function() {
                throw new Error("popMatrix() not used, see pop()")
            }
            ,
            n.prototype.printMatrix = function() {
                throw new Error("printMatrix() not implemented")
            }
            ,
            n.prototype.pushMatrix = function() {
                throw new Error("pushMatrix() not used, see push()")
            }
            ,
            n.prototype.resetMatrix = function() {
                return this._renderer.resetMatrix(),
                this
            }
            ,
            n.prototype.rotate = function() {
                for (var t, e = new Array(arguments.length), r = 0; r < e.length; ++r)
                    e[r] = arguments[r];
                return this._angleMode === i.DEGREES && (t = this.radians(e[0])),
                e.length > 1 ? this._renderer.rotate(t, e[1]) : this._renderer.rotate(t),
                this
            }
            ,
            n.prototype.rotateX = function(t) {
                for (var e = new Array(arguments.length), r = 0; r < e.length; ++r)
                    e[r] = arguments[r];
                if (!this._renderer.isP3D)
                    throw "not supported in p2d. Please use webgl mode";
                return this._validateParameters("rotateX", e, [["Number"]]),
                this._renderer.rotateX(t),
                this
            }
            ,
            n.prototype.rotateY = function(t) {
                if (!this._renderer.isP3D)
                    throw "not supported in p2d. Please use webgl mode";
                for (var e = new Array(arguments.length), r = 0; r < e.length; ++r)
                    e[r] = arguments[r];
                return this._validateParameters("rotateY", e, [["Number"]]),
                this._renderer.rotateY(t),
                this
            }
            ,
            n.prototype.rotateZ = function(t) {
                if (!this._renderer.isP3D)
                    throw "not supported in p2d. Please use webgl mode";
                for (var e = new Array(arguments.length), r = 0; r < e.length; ++r)
                    e[r] = arguments[r];
                return this._validateParameters("rotateZ", e, [["Number"]]),
                this._renderer.rotateZ(t),
                this
            }
            ,
            n.prototype.scale = function() {
                for (var t, e, r, i = new Array(arguments.length), o = 0; o < i.length; o++)
                    i[o] = arguments[o];
                return i[0]instanceof n.Vector ? (t = i[0].x,
                e = i[0].y,
                r = i[0].z) : i[0]instanceof Array ? (t = i[0][0],
                e = i[0][1],
                r = i[0][2] || 1) : 1 === i.length ? t = e = r = i[0] : (t = i[0],
                e = i[1],
                r = i[2] || 1),
                this._renderer.isP3D ? this._renderer.scale.call(this._renderer, t, e, r) : this._renderer.scale.call(this._renderer, t, e),
                this
            }
            ,
            n.prototype.shearX = function(t) {
                return this._angleMode === i.DEGREES && (t = this.radians(t)),
                this._renderer.shearX(t),
                this
            }
            ,
            n.prototype.shearY = function(t) {
                return this._angleMode === i.DEGREES && (t = this.radians(t)),
                this._renderer.shearY(t),
                this
            }
            ,
            n.prototype.translate = function(t, e, r) {
                for (var n = new Array(arguments.length), i = 0; i < n.length; ++i)
                    n[i] = arguments[i];
                return this._renderer.isP3D ? (this._validateParameters("translate", n, [["Number", "Number", "Number"]]),
                this._renderer.translate(t, e, r)) : (this._validateParameters("translate", n, [["Number", "Number"]]),
                this._renderer.translate(t, e)),
                this
            }
            ,
            e.exports = n
        }
        , {
            "./constants": 36,
            "./core": 37
        }],
        49: [function(t, e, r) {
            "use strict";
            var n = t("./core")
              , i = t("./constants")
              , o = null
              , s = []
              , a = []
              , h = !1
              , u = !1
              , l = !1
              , p = !1
              , c = !0;
            n.prototype.beginContour = function() {
                return a = [],
                p = !0,
                this
            }
            ,
            n.prototype.beginShape = function(t) {
                return o = t === i.POINTS || t === i.LINES || t === i.TRIANGLES || t === i.TRIANGLE_FAN || t === i.TRIANGLE_STRIP || t === i.QUADS || t === i.QUAD_STRIP ? t : null,
                this._renderer.isP3D ? this._renderer.beginShape(t) : (s = [],
                a = []),
                this
            }
            ,
            n.prototype.bezierVertex = function(t, e, r, n, i, o) {
                if (0 === s.length)
                    throw "vertex() must be used once before calling bezierVertex()";
                h = !0;
                for (var u = [], l = 0; l < arguments.length; l++)
                    u[l] = arguments[l];
                return u.isVert = !1,
                p ? a.push(u) : s.push(u),
                this
            }
            ,
            n.prototype.curveVertex = function(t, e) {
                return u = !0,
                this.vertex(t, e),
                this
            }
            ,
            n.prototype.endContour = function() {
                var t = a[0].slice();
                t.isVert = a[0].isVert,
                t.moveTo = !1,
                a.push(t),
                c && (s.push(s[0]),
                c = !1);
                for (var e = 0; e < a.length; e++)
                    s.push(a[e]);
                return this
            }
            ,
            n.prototype.endShape = function(t) {
                if (this._renderer.isP3D)
                    this._renderer.endShape(t, u, h, l, p, o);
                else {
                    if (0 === s.length)
                        return this;
                    if (!this._renderer._doStroke && !this._renderer._doFill)
                        return this;
                    var e = t === i.CLOSE;
                    e && !p && s.push(s[0]),
                    this._renderer.endShape(t, s, u, h, l, p, o),
                    u = !1,
                    h = !1,
                    l = !1,
                    p = !1,
                    c = !0,
                    e && s.pop()
                }
                return this
            }
            ,
            n.prototype.quadraticVertex = function(t, e, r, n) {
                if (this._contourInited) {
                    var o = {};
                    return o.x = t,
                    o.y = e,
                    o.x3 = r,
                    o.y3 = n,
                    o.type = i.QUADRATIC,
                    this._contourVertices.push(o),
                    this
                }
                if (!(s.length > 0))
                    throw "vertex() must be used once before calling quadraticVertex()";
                l = !0;
                for (var h = [], u = 0; u < arguments.length; u++)
                    h[u] = arguments[u];
                return h.isVert = !1,
                p ? a.push(h) : s.push(h),
                this
            }
            ,
            n.prototype.vertex = function(t, e, r) {
                for (var n = new Array(arguments.length), i = 0; i < n.length; ++i)
                    n[i] = arguments[i];
                if (this._renderer.isP3D)
                    this._validateParameters("vertex", n, [["Number", "Number", "Number"]]),
                    this._renderer.vertex(arguments[0], arguments[1], arguments[2]);
                else {
                    this._validateParameters("vertex", n, [["Number", "Number"], ["Number", "Number", "Number"]]);
                    var o = [];
                    o.isVert = !0,
                    o[0] = t,
                    o[1] = e,
                    o[2] = 0,
                    o[3] = 0,
                    o[4] = 0,
                    o[5] = this._renderer._getFill(),
                    o[6] = this._renderer._getStroke(),
                    r && (o.moveTo = r),
                    p ? (0 === a.length && (o.moveTo = !0),
                    a.push(o)) : s.push(o)
                }
                return this
            }
            ,
            e.exports = n
        }
        , {
            "./constants": 36,
            "./core": 37
        }],
        50: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.prototype.deviceOrientation = void 0,
            n.prototype.accelerationX = 0,
            n.prototype.accelerationY = 0,
            n.prototype.accelerationZ = 0,
            n.prototype.pAccelerationX = 0,
            n.prototype.pAccelerationY = 0,
            n.prototype.pAccelerationZ = 0,
            n.prototype._updatePAccelerations = function() {
                this._setProperty("pAccelerationX", this.accelerationX),
                this._setProperty("pAccelerationY", this.accelerationY),
                this._setProperty("pAccelerationZ", this.accelerationZ)
            }
            ,
            n.prototype.rotationX = 0,
            n.prototype.rotationY = 0,
            n.prototype.rotationZ = 0,
            n.prototype.pRotationX = 0,
            n.prototype.pRotationY = 0,
            n.prototype.pRotationZ = 0;
            var i, o, s, a = 0, h = 0, u = 0, l = "clockwise", p = "clockwise", c = "clockwise";
            n.prototype._updatePRotations = function() {
                this._setProperty("pRotationX", this.rotationX),
                this._setProperty("pRotationY", this.rotationY),
                this._setProperty("pRotationZ", this.rotationZ)
            }
            ,
            n.prototype.turnAxis = void 0;
            var d = .5
              , f = 30;
            n.prototype.setMoveThreshold = function(t) {
                "number" == typeof t && (d = t)
            }
            ,
            n.prototype.setShakeThreshold = function(t) {
                "number" == typeof t && (f = t)
            }
            ,
            n.prototype._ondeviceorientation = function(t) {
                this._updatePRotations(),
                this._setProperty("rotationX", t.beta),
                this._setProperty("rotationY", t.gamma),
                this._setProperty("rotationZ", t.alpha),
                this._handleMotion()
            }
            ,
            n.prototype._ondevicemotion = function(t) {
                this._updatePAccelerations(),
                this._setProperty("accelerationX", 2 * t.acceleration.x),
                this._setProperty("accelerationY", 2 * t.acceleration.y),
                this._setProperty("accelerationZ", 2 * t.acceleration.z),
                this._handleMotion()
            }
            ,
            n.prototype._handleMotion = function() {
                90 === window.orientation || -90 === window.orientation ? this._setProperty("deviceOrientation", "landscape") : 0 === window.orientation ? this._setProperty("deviceOrientation", "portrait") : void 0 === window.orientation && this._setProperty("deviceOrientation", "undefined");
                var t = this.deviceMoved || window.deviceMoved;
                "function" == typeof t && (Math.abs(this.accelerationX - this.pAccelerationX) > d || Math.abs(this.accelerationY - this.pAccelerationY) > d || Math.abs(this.accelerationZ - this.pAccelerationZ) > d) && t();
                var e = this.deviceTurned || window.deviceTurned;
                if ("function" == typeof e) {
                    var r = this.rotationX + 180
                      , n = this.pRotationX + 180
                      , m = a + 180;
                    r - n > 0 && 270 > r - n || -270 > r - n ? l = "clockwise" : (0 > r - n || r - n > 270) && (l = "counter-clockwise"),
                    l !== i && (m = r),
                    Math.abs(r - m) > 90 && Math.abs(r - m) < 270 && (m = r,
                    this._setProperty("turnAxis", "X"),
                    e()),
                    i = l,
                    a = m - 180;
                    var y = this.rotationY + 180
                      , g = this.pRotationY + 180
                      , v = h + 180;
                    y - g > 0 && 270 > y - g || -270 > y - g ? p = "clockwise" : (0 > y - g || y - this.pRotationY > 270) && (p = "counter-clockwise"),
                    p !== o && (v = y),
                    Math.abs(y - v) > 90 && Math.abs(y - v) < 270 && (v = y,
                    this._setProperty("turnAxis", "Y"),
                    e()),
                    o = p,
                    h = v - 180,
                    this.rotationZ - this.pRotationZ > 0 && this.rotationZ - this.pRotationZ < 270 || this.rotationZ - this.pRotationZ < -270 ? c = "clockwise" : (this.rotationZ - this.pRotationZ < 0 || this.rotationZ - this.pRotationZ > 270) && (c = "counter-clockwise"),
                    c !== s && (u = this.rotationZ),
                    Math.abs(this.rotationZ - u) > 90 && Math.abs(this.rotationZ - u) < 270 && (u = this.rotationZ,
                    this._setProperty("turnAxis", "Z"),
                    e()),
                    s = c,
                    this._setProperty("turnAxis", void 0)
                }
                var _ = this.deviceShaken || window.deviceShaken;
                if ("function" == typeof _) {
                    var x, b;
                    null !== this.pAccelerationX && (x = Math.abs(this.accelerationX - this.pAccelerationX),
                    b = Math.abs(this.accelerationY - this.pAccelerationY)),
                    x + b > f && _()
                }
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        51: [function(t, e, r) {
            "use strict";
            var n = t("../core/core")
              , i = {};
            n.prototype.isKeyPressed = !1,
            n.prototype.keyIsPressed = !1,
            n.prototype.key = "",
            n.prototype.keyCode = 0,
            n.prototype._onkeydown = function(t) {
                if (!i[t.which]) {
                    this._setProperty("isKeyPressed", !0),
                    this._setProperty("keyIsPressed", !0),
                    this._setProperty("keyCode", t.which),
                    i[t.which] = !0;
                    var e = String.fromCharCode(t.which);
                    e || (e = t.which),
                    this._setProperty("key", e);
                    var r = this.keyPressed || window.keyPressed;
                    if ("function" == typeof r && !t.charCode) {
                        var n = r(t);
                        n === !1 && t.preventDefault()
                    }
                }
            }
            ,
            n.prototype._onkeyup = function(t) {
                var e = this.keyReleased || window.keyReleased;
                this._setProperty("isKeyPressed", !1),
                this._setProperty("keyIsPressed", !1),
                this._setProperty("_lastKeyCodeTyped", null),
                i[t.which] = !1;
                var r = String.fromCharCode(t.which);
                if (r || (r = t.which),
                this._setProperty("key", r),
                this._setProperty("keyCode", t.which),
                "function" == typeof e) {
                    var n = e(t);
                    n === !1 && t.preventDefault()
                }
            }
            ,
            n.prototype._onkeypress = function(t) {
                if (t.which !== this._lastKeyCodeTyped) {
                    this._setProperty("keyCode", t.which),
                    this._setProperty("_lastKeyCodeTyped", t.which),
                    this._setProperty("key", String.fromCharCode(t.which));
                    var e = this.keyTyped || window.keyTyped;
                    if ("function" == typeof e) {
                        var r = e(t);
                        r === !1 && t.preventDefault()
                    }
                }
            }
            ,
            n.prototype._onblur = function(t) {
                i = {}
            }
            ,
            n.prototype.keyIsDown = function(t) {
                return i[t]
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        52: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                var r = t.getBoundingClientRect();
                return {
                    x: e.clientX - r.left,
                    y: e.clientY - r.top
                }
            }
            var i = t("../core/core")
              , o = t("../core/constants");
            i.prototype._nextMouseX = 0,
            i.prototype._nextMouseY = 0,
            i.prototype.mouseX = 0,
            i.prototype.mouseY = 0,
            i.prototype.pmouseX = 0,
            i.prototype.pmouseY = 0,
            i.prototype.winMouseX = 0,
            i.prototype.winMouseY = 0,
            i.prototype.pwinMouseX = 0,
            i.prototype.pwinMouseY = 0,
            i.prototype.mouseButton = 0,
            i.prototype.mouseIsPressed = !1,
            i.prototype.isMousePressed = !1,
            i.prototype._updateNextMouseCoords = function(t) {
                if ("touchstart" === t.type || "touchmove" === t.type || "touchend" === t.type || t.touches)
                    this._setProperty("_nextMouseX", this._nextTouchX),
                    this._setProperty("_nextMouseY", this._nextTouchY);
                else if (null !== this._curElement) {
                    var e = n(this._curElement.elt, t);
                    this._setProperty("_nextMouseX", e.x),
                    this._setProperty("_nextMouseY", e.y)
                }
                this._setProperty("winMouseX", t.pageX),
                this._setProperty("winMouseY", t.pageY)
            }
            ,
            i.prototype._updateMouseCoords = function() {
                this._setProperty("pmouseX", this.mouseX),
                this._setProperty("pmouseY", this.mouseY),
                this._setProperty("mouseX", this._nextMouseX),
                this._setProperty("mouseY", this._nextMouseY),
                this._setProperty("pwinMouseX", this.winMouseX),
                this._setProperty("pwinMouseY", this.winMouseY)
            }
            ,
            i.prototype._setMouseButton = function(t) {
                1 === t.button ? this._setProperty("mouseButton", o.CENTER) : 2 === t.button ? this._setProperty("mouseButton", o.RIGHT) : this._setProperty("mouseButton", o.LEFT)
            }
            ,
            i.prototype._onmousemove = function(t) {
                var e, r = this._isGlobal ? window : this;
                this._updateNextMouseCoords(t),
                this._updateNextTouchCoords(t),
                this.isMousePressed ? "function" == typeof r.mouseDragged ? (e = r.mouseDragged(t),
                e === !1 && t.preventDefault()) : "function" == typeof r.touchMoved && (e = r.touchMoved(t),
                e === !1 && t.preventDefault()) : "function" == typeof r.mouseMoved && (e = r.mouseMoved(t),
                e === !1 && t.preventDefault())
            }
            ,
            i.prototype._onmousedown = function(t) {
                var e, r = this._isGlobal ? window : this;
                this._setProperty("isMousePressed", !0),
                this._setProperty("mouseIsPressed", !0),
                this._setMouseButton(t),
                this._updateNextMouseCoords(t),
                this._updateNextTouchCoords(t),
                "function" == typeof r.mousePressed ? (e = r.mousePressed(t),
                e === !1 && t.preventDefault()) : "function" == typeof r.touchStarted && (e = r.touchStarted(t),
                e === !1 && t.preventDefault())
            }
            ,
            i.prototype._onmouseup = function(t) {
                var e, r = this._isGlobal ? window : this;
                this._setProperty("isMousePressed", !1),
                this._setProperty("mouseIsPressed", !1),
                "function" == typeof r.mouseReleased ? (e = r.mouseReleased(t),
                e === !1 && t.preventDefault()) : "function" == typeof r.touchEnded && (e = r.touchEnded(t),
                e === !1 && t.preventDefault())
            }
            ,
            i.prototype._ondragend = i.prototype._onmouseup,
            i.prototype._ondragover = i.prototype._onmousemove,
            i.prototype._onclick = function(t) {
                var e = this._isGlobal ? window : this;
                if ("function" == typeof e.mouseClicked) {
                    var r = e.mouseClicked(t);
                    r === !1 && t.preventDefault()
                }
            }
            ,
            i.prototype._onwheel = function(t) {
                var e = this._isGlobal ? window : this;
                if ("function" == typeof e.mouseWheel) {
                    t.delta = t.deltaY;
                    var r = e.mouseWheel(t);
                    r === !1 && t.preventDefault()
                }
            }
            ,
            e.exports = i
        }
        , {
            "../core/constants": 36,
            "../core/core": 37
        }],
        53: [function(t, e, r) {
            "use strict";
            function n(t, e, r) {
                r = r || 0;
                var n = t.getBoundingClientRect()
                  , i = e.touches[r] || e.changedTouches[r];
                return {
                    x: i.clientX - n.left,
                    y: i.clientY - n.top,
                    id: i.identifier
                }
            }
            var i = t("../core/core");
            i.prototype._nextTouchX = 0,
            i.prototype._nextTouchY = 0,
            i.prototype.touchX = 0,
            i.prototype.touchY = 0,
            i.prototype.ptouchX = 0,
            i.prototype.ptouchY = 0,
            i.prototype.touches = [],
            i.prototype.touchIsDown = !1,
            i.prototype._updateNextTouchCoords = function(t) {
                if ("mousedown" !== t.type && "mousemove" !== t.type && "mouseup" !== t.type && t.touches) {
                    if (null !== this._curElement) {
                        var e = n(this._curElement.elt, t, 0);
                        this._setProperty("_nextTouchX", e.x),
                        this._setProperty("_nextTouchY", e.y);
                        for (var r = [], i = 0; i < t.touches.length; i++)
                            r[i] = n(this._curElement.elt, t, i);
                        this._setProperty("touches", r)
                    }
                } else
                    this._setProperty("_nextTouchX", this._nextMouseX),
                    this._setProperty("_nextTouchY", this._nextMouseY)
            }
            ,
            i.prototype._updateTouchCoords = function() {
                this._setProperty("ptouchX", this.touchX),
                this._setProperty("ptouchY", this.touchY),
                this._setProperty("touchX", this._nextTouchX),
                this._setProperty("touchY", this._nextTouchY)
            }
            ,
            i.prototype._ontouchstart = function(t) {
                var e, r = this._isGlobal ? window : this;
                this._updateNextTouchCoords(t),
                this._updateNextMouseCoords(t),
                this._setProperty("touchIsDown", !0),
                "function" == typeof r.touchStarted ? (e = r.touchStarted(t),
                e === !1 && t.preventDefault()) : "function" == typeof r.mousePressed && (e = r.mousePressed(t),
                e === !1 && t.preventDefault())
            }
            ,
            i.prototype._ontouchmove = function(t) {
                var e, r = this._isGlobal ? window : this;
                this._updateNextTouchCoords(t),
                this._updateNextMouseCoords(t),
                "function" == typeof r.touchMoved ? (e = r.touchMoved(t),
                e === !1 && t.preventDefault()) : "function" == typeof r.mouseDragged && (e = r.mouseDragged(t),
                e === !1 && t.preventDefault())
            }
            ,
            i.prototype._ontouchend = function(t) {
                this._updateNextTouchCoords(t),
                this._updateNextMouseCoords(t),
                0 === this.touches.length && this._setProperty("touchIsDown", !1);
                var e, r = this._isGlobal ? window : this;
                "function" == typeof r.touchEnded ? (e = r.touchEnded(t),
                e === !1 && t.preventDefault()) : "function" == typeof r.mouseReleased && (e = r.mouseReleased(t),
                e === !1 && t.preventDefault())
            }
            ,
            e.exports = i
        }
        , {
            "../core/core": 37
        }],
        54: [function(t, e, r) {
            "use strict";
            function n(t) {
                var e = 3.5 * t | 0;
                if (e = 1 > e ? 1 : 248 > e ? e : 248,
                s !== e) {
                    s = e,
                    a = 1 + s << 1,
                    h = new Int32Array(a),
                    u = new Array(a);
                    for (var r = 0; a > r; r++)
                        u[r] = new Int32Array(256);
                    for (var n, i, o, l, p = 1, c = e - 1; e > p; p++) {
                        h[e + p] = h[c] = i = c * c,
                        o = u[e + p],
                        l = u[c--];
                        for (var d = 0; 256 > d; d++)
                            o[d] = l[d] = i * d
                    }
                    n = h[e] = e * e,
                    o = u[e];
                    for (var f = 0; 256 > f; f++)
                        o[f] = n * f
                }
            }
            function i(t, e) {
                for (var r = o._toPixels(t), i = t.width, l = t.height, p = i * l, c = new Int32Array(p), d = 0; p > d; d++)
                    c[d] = o._getARGB(r, d);
                var f, m, y, g, v, _, x, b, T, w, S = new Int32Array(p), M = new Int32Array(p), A = new Int32Array(p), C = new Int32Array(p), R = 0;
                n(e);
                var E, P, N, O;
                for (P = 0; l > P; P++) {
                    for (E = 0; i > E; E++) {
                        if (g = y = m = v = f = 0,
                        _ = E - s,
                        0 > _)
                            w = -_,
                            _ = 0;
                        else {
                            if (_ >= i)
                                break;
                            w = 0
                        }
                        for (N = w; a > N && !(_ >= i); N++) {
                            var k = c[_ + R];
                            O = u[N],
                            v += O[(-16777216 & k) >>> 24],
                            m += O[(16711680 & k) >> 16],
                            y += O[(65280 & k) >> 8],
                            g += O[255 & k],
                            f += h[N],
                            _++
                        }
                        x = R + E,
                        S[x] = v / f,
                        M[x] = m / f,
                        A[x] = y / f,
                        C[x] = g / f
                    }
                    R += i
                }
                for (R = 0,
                b = -s,
                T = b * i,
                P = 0; l > P; P++) {
                    for (E = 0; i > E; E++) {
                        if (g = y = m = v = f = 0,
                        0 > b)
                            w = x = -b,
                            _ = E;
                        else {
                            if (b >= l)
                                break;
                            w = 0,
                            x = b,
                            _ = E + T
                        }
                        for (N = w; a > N && !(x >= l); N++)
                            O = u[N],
                            v += O[S[_]],
                            m += O[M[_]],
                            y += O[A[_]],
                            g += O[C[_]],
                            f += h[N],
                            x++,
                            _ += i;
                        c[E + R] = v / f << 24 | m / f << 16 | y / f << 8 | g / f
                    }
                    R += i,
                    T += i,
                    b++
                }
                o._setPixels(r, c)
            }
            var o = {};
            o._toPixels = function(t) {
                return t instanceof ImageData ? t.data : t.getContext("2d").getImageData(0, 0, t.width, t.height).data
            }
            ,
            o._getARGB = function(t, e) {
                var r = 4 * e;
                return t[r + 3] << 24 & 4278190080 | t[r] << 16 & 16711680 | t[r + 1] << 8 & 65280 | 255 & t[r + 2]
            }
            ,
            o._setPixels = function(t, e) {
                for (var r = 0, n = 0, i = t.length; i > n; n++)
                    r = 4 * n,
                    t[r + 0] = (16711680 & e[n]) >>> 16,
                    t[r + 1] = (65280 & e[n]) >>> 8,
                    t[r + 2] = 255 & e[n],
                    t[r + 3] = (4278190080 & e[n]) >>> 24
            }
            ,
            o._toImageData = function(t) {
                return t instanceof ImageData ? t : t.getContext("2d").getImageData(0, 0, t.width, t.height)
            }
            ,
            o._createImageData = function(t, e) {
                return o._tmpCanvas = document.createElement("canvas"),
                o._tmpCtx = o._tmpCanvas.getContext("2d"),
                this._tmpCtx.createImageData(t, e)
            }
            ,
            o.apply = function(t, e, r) {
                var n = t.getContext("2d")
                  , i = n.getImageData(0, 0, t.width, t.height)
                  , o = e(i, r);
                o instanceof ImageData ? n.putImageData(o, 0, 0, 0, 0, t.width, t.height) : n.putImageData(i, 0, 0, 0, 0, t.width, t.height)
            }
            ,
            o.threshold = function(t, e) {
                var r = o._toPixels(t);
                void 0 === e && (e = .5);
                for (var n = Math.floor(255 * e), i = 0; i < r.length; i += 4) {
                    var s, a = r[i], h = r[i + 1], u = r[i + 2], l = .2126 * a + .7152 * h + .0722 * u;
                    s = l >= n ? 255 : 0,
                    r[i] = r[i + 1] = r[i + 2] = s
                }
            }
            ,
            o.gray = function(t) {
                for (var e = o._toPixels(t), r = 0; r < e.length; r += 4) {
                    var n = e[r]
                      , i = e[r + 1]
                      , s = e[r + 2]
                      , a = .2126 * n + .7152 * i + .0722 * s;
                    e[r] = e[r + 1] = e[r + 2] = a
                }
            }
            ,
            o.opaque = function(t) {
                for (var e = o._toPixels(t), r = 0; r < e.length; r += 4)
                    e[r + 3] = 255;
                return e
            }
            ,
            o.invert = function(t) {
                for (var e = o._toPixels(t), r = 0; r < e.length; r += 4)
                    e[r] = 255 - e[r],
                    e[r + 1] = 255 - e[r + 1],
                    e[r + 2] = 255 - e[r + 2]
            }
            ,
            o.posterize = function(t, e) {
                var r = o._toPixels(t);
                if (2 > e || e > 255)
                    throw new Error("Level must be greater than 2 and less than 255 for posterize");
                for (var n = e - 1, i = 0; i < r.length; i += 4) {
                    var s = r[i]
                      , a = r[i + 1]
                      , h = r[i + 2];
                    r[i] = 255 * (s * e >> 8) / n,
                    r[i + 1] = 255 * (a * e >> 8) / n,
                    r[i + 2] = 255 * (h * e >> 8) / n
                }
            }
            ,
            o.dilate = function(t) {
                for (var e, r, n, i, s, a, h, u, l, p, c, d, f, m, y, g, v, _ = o._toPixels(t), x = 0, b = _.length ? _.length / 4 : 0, T = new Int32Array(b); b > x; )
                    for (e = x,
                    r = x + t.width; r > x; )
                        n = i = o._getARGB(_, x),
                        h = x - 1,
                        a = x + 1,
                        u = x - t.width,
                        l = x + t.width,
                        e > h && (h = x),
                        a >= r && (a = x),
                        0 > u && (u = 0),
                        l >= b && (l = x),
                        d = o._getARGB(_, u),
                        c = o._getARGB(_, h),
                        f = o._getARGB(_, l),
                        p = o._getARGB(_, a),
                        s = 77 * (n >> 16 & 255) + 151 * (n >> 8 & 255) + 28 * (255 & n),
                        y = 77 * (c >> 16 & 255) + 151 * (c >> 8 & 255) + 28 * (255 & c),
                        m = 77 * (p >> 16 & 255) + 151 * (p >> 8 & 255) + 28 * (255 & p),
                        g = 77 * (d >> 16 & 255) + 151 * (d >> 8 & 255) + 28 * (255 & d),
                        v = 77 * (f >> 16 & 255) + 151 * (f >> 8 & 255) + 28 * (255 & f),
                        y > s && (i = c,
                        s = y),
                        m > s && (i = p,
                        s = m),
                        g > s && (i = d,
                        s = g),
                        v > s && (i = f,
                        s = v),
                        T[x++] = i;
                o._setPixels(_, T)
            }
            ,
            o.erode = function(t) {
                for (var e, r, n, i, s, a, h, u, l, p, c, d, f, m, y, g, v, _ = o._toPixels(t), x = 0, b = _.length ? _.length / 4 : 0, T = new Int32Array(b); b > x; )
                    for (e = x,
                    r = x + t.width; r > x; )
                        n = i = o._getARGB(_, x),
                        h = x - 1,
                        a = x + 1,
                        u = x - t.width,
                        l = x + t.width,
                        e > h && (h = x),
                        a >= r && (a = x),
                        0 > u && (u = 0),
                        l >= b && (l = x),
                        d = o._getARGB(_, u),
                        c = o._getARGB(_, h),
                        f = o._getARGB(_, l),
                        p = o._getARGB(_, a),
                        s = 77 * (n >> 16 & 255) + 151 * (n >> 8 & 255) + 28 * (255 & n),
                        y = 77 * (c >> 16 & 255) + 151 * (c >> 8 & 255) + 28 * (255 & c),
                        m = 77 * (p >> 16 & 255) + 151 * (p >> 8 & 255) + 28 * (255 & p),
                        g = 77 * (d >> 16 & 255) + 151 * (d >> 8 & 255) + 28 * (255 & d),
                        v = 77 * (f >> 16 & 255) + 151 * (f >> 8 & 255) + 28 * (255 & f),
                        s > y && (i = c,
                        s = y),
                        s > m && (i = p,
                        s = m),
                        s > g && (i = d,
                        s = g),
                        s > v && (i = f,
                        s = v),
                        T[x++] = i;
                o._setPixels(_, T)
            }
            ;
            var s, a, h, u;
            o.blur = function(t, e) {
                i(t, e)
            }
            ,
            e.exports = o
        }
        , {}],
        55: [function(t, e, r) {
            "use strict";
            var n = t("../core/core")
              , i = [];
            n.prototype.createImage = function(t, e) {
                return new n.Image(t,e)
            }
            ,
            n.prototype.saveCanvas = function() {
                var t, e, r;
                if (3 === arguments.length ? (t = arguments[0],
                e = arguments[1],
                r = arguments[2]) : 2 === arguments.length ? "object" == typeof arguments[0] ? (t = arguments[0],
                e = arguments[1]) : (e = arguments[0],
                r = arguments[1]) : 1 === arguments.length && ("object" == typeof arguments[0] ? t = arguments[0] : e = arguments[0]),
                t instanceof n.Element && (t = t.elt),
                t instanceof HTMLCanvasElement || (t = null),
                r || (r = n.prototype._checkFileExtension(e, r)[1],
                "" === r && (r = "png")),
                t || this._curElement && this._curElement.elt && (t = this._curElement.elt),
                n.prototype._isSafari()) {
                    var i = "Hello, Safari user!\n";
                    i += "Now capturing a screenshot...\n",
                    i += "To save this image,\n",
                    i += "go to File --> Save As.\n",
                    alert(i),
                    window.location.href = t.toDataURL()
                } else {
                    var o;
                    if ("undefined" == typeof r)
                        r = "png",
                        o = "image/png";
                    else
                        switch (r) {
                        case "png":
                            o = "image/png";
                            break;
                        case "jpeg":
                            o = "image/jpeg";
                            break;
                        case "jpg":
                            o = "image/jpeg";
                            break;
                        default:
                            o = "image/png"
                        }
                    var s = "image/octet-stream"
                      , a = t.toDataURL(o);
                    a = a.replace(o, s),
                    n.prototype.downloadFile(a, e, r)
                }
            }
            ,
            n.prototype.saveFrames = function(t, e, r, o, s) {
                var a = r || 3;
                a = n.prototype.constrain(a, 0, 15),
                a = 1e3 * a;
                var h = o || 15;
                h = n.prototype.constrain(h, 0, 22);
                var u = 0
                  , l = n.prototype._makeFrame
                  , p = this._curElement.elt
                  , c = setInterval(function() {
                    l(t + u, e, p),
                    u++
                }, 1e3 / h);
                setTimeout(function() {
                    if (clearInterval(c),
                    s)
                        s(i);
                    else
                        for (var t = 0; t < i.length; t++) {
                            var e = i[t];
                            n.prototype.downloadFile(e.imageData, e.filename, e.ext)
                        }
                    i = []
                }, a + .01)
            }
            ,
            n.prototype._makeFrame = function(t, e, r) {
                var n;
                n = this ? this._curElement.elt : r;
                var o;
                if (e)
                    switch (e.toLowerCase()) {
                    case "png":
                        o = "image/png";
                        break;
                    case "jpeg":
                        o = "image/jpeg";
                        break;
                    case "jpg":
                        o = "image/jpeg";
                        break;
                    default:
                        o = "image/png"
                    }
                else
                    e = "png",
                    o = "image/png";
                var s = "image/octet-stream"
                  , a = n.toDataURL(o);
                a = a.replace(o, s);
                var h = {};
                h.imageData = a,
                h.filename = t,
                h.ext = e,
                i.push(h)
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        56: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                return t > 0 && e > t ? t : e
            }
            var i = t("../core/core")
              , o = t("./filters")
              , s = t("../core/canvas")
              , a = t("../core/constants");
            t("../core/error_helpers"),
            i.prototype.loadImage = function(t, e, r) {
                var n = new Image
                  , o = new i.Image(1,1,this)
                  , s = i._getDecrementPreload.apply(this, arguments);
                return n.onload = function() {
                    o.width = o.canvas.width = n.width,
                    o.height = o.canvas.height = n.height,
                    o.drawingContext.drawImage(n, 0, 0),
                    "function" == typeof e && e(o),
                    s && e !== s && s()
                }
                ,
                n.onerror = function(t) {
                    i._friendlyFileLoadError(0, n.src),
                    "function" == typeof r && r !== s && r(t)
                }
                ,
                0 !== t.indexOf("data:image/") && (n.crossOrigin = "Anonymous"),
                n.src = t,
                o
            }
            ,
            i.prototype.image = function(t, e, r, i, o, a, h, u, l) {
                if (arguments.length <= 5)
                    if (a = e || 0,
                    h = r || 0,
                    e = 0,
                    r = 0,
                    t.elt && t.elt.videoWidth && !t.canvas) {
                        var p = t.elt.videoWidth
                          , c = t.elt.videoHeight;
                        u = i || t.elt.width,
                        l = o || t.elt.width * c / p,
                        i = p,
                        o = c
                    } else
                        u = i || t.width,
                        l = o || t.height,
                        i = t.width,
                        o = t.height;
                else {
                    if (9 !== arguments.length)
                        throw "Wrong number of arguments to image()";
                    e = e || 0,
                    r = r || 0,
                    i = n(i, t.width),
                    o = n(o, t.height),
                    a = a || 0,
                    h = h || 0,
                    u = u || t.width,
                    l = l || t.height
                }
                var d = s.modeAdjust(a, h, u, l, this._renderer._imageMode);
                this._renderer.image(t, e, r, i, o, d.x, d.y, d.w, d.h)
            }
            ,
            i.prototype.tint = function() {
                var t = this.color.apply(this, arguments);
                this._renderer._tint = t.levels
            }
            ,
            i.prototype.noTint = function() {
                this._renderer._tint = null
            }
            ,
            i.prototype._getTintedImageCanvas = function(t) {
                if (!t.canvas)
                    return t;
                var e = o._toPixels(t.canvas)
                  , r = document.createElement("canvas");
                r.width = t.canvas.width,
                r.height = t.canvas.height;
                for (var n = r.getContext("2d"), i = n.createImageData(t.canvas.width, t.canvas.height), s = i.data, a = 0; a < e.length; a += 4) {
                    var h = e[a]
                      , u = e[a + 1]
                      , l = e[a + 2]
                      , p = e[a + 3];
                    s[a] = h * this._renderer._tint[0] / 255,
                    s[a + 1] = u * this._renderer._tint[1] / 255,
                    s[a + 2] = l * this._renderer._tint[2] / 255,
                    s[a + 3] = p * this._renderer._tint[3] / 255
                }
                return n.putImageData(i, 0, 0),
                r
            }
            ,
            i.prototype.imageMode = function(t) {
                (t === a.CORNER || t === a.CORNERS || t === a.CENTER) && (this._renderer._imageMode = t)
            }
            ,
            e.exports = i
        }
        , {
            "../core/canvas": 35,
            "../core/constants": 36,
            "../core/core": 37,
            "../core/error_helpers": 40,
            "./filters": 54
        }],
        57: [function(t, e, r) {
            "use strict";
            var n = t("../core/core")
              , i = t("./filters");
            n.Image = function(t, e) {
                this.width = t,
                this.height = e,
                this.canvas = document.createElement("canvas"),
                this.canvas.width = this.width,
                this.canvas.height = this.height,
                this.drawingContext = this.canvas.getContext("2d"),
                this._pixelDensity = 1,
                this.isTexture = !1,
                this.pixels = []
            }
            ,
            n.Image.prototype._setProperty = function(t, e) {
                this[t] = e
            }
            ,
            n.Image.prototype.loadPixels = function() {
                n.Renderer2D.prototype.loadPixels.call(this)
            }
            ,
            n.Image.prototype.updatePixels = function(t, e, r, i) {
                n.Renderer2D.prototype.updatePixels.call(this, t, e, r, i)
            }
            ,
            n.Image.prototype.get = function(t, e, r, i) {
                return n.Renderer2D.prototype.get.call(this, t, e, r, i)
            }
            ,
            n.Image.prototype.set = function(t, e, r) {
                n.Renderer2D.prototype.set.call(this, t, e, r)
            }
            ,
            n.Image.prototype.resize = function(t, e) {
                0 === t && 0 === e ? (t = this.canvas.width,
                e = this.canvas.height) : 0 === t ? t = this.canvas.width * e / this.canvas.height : 0 === e && (e = this.canvas.height * t / this.canvas.width);
                var r = document.createElement("canvas");
                r.width = t,
                r.height = e,
                r.getContext("2d").drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, r.width, r.height),
                this.canvas.width = this.width = t,
                this.canvas.height = this.height = e,
                this.drawingContext.drawImage(r, 0, 0, t, e, 0, 0, t, e),
                this.pixels.length > 0 && this.loadPixels()
            }
            ,
            n.Image.prototype.copy = function() {
                n.prototype.copy.apply(this, arguments)
            }
            ,
            n.Image.prototype.mask = function(t) {
                void 0 === t && (t = this);
                var e = this.drawingContext.globalCompositeOperation
                  , r = 1;
                t instanceof n.Renderer && (r = t._pInst._pixelDensity);
                var i = [t, 0, 0, r * t.width, r * t.height, 0, 0, this.width, this.height];
                this.drawingContext.globalCompositeOperation = "destination-in",
                this.copy.apply(this, i),
                this.drawingContext.globalCompositeOperation = e
            }
            ,
            n.Image.prototype.filter = function(t, e) {
                i.apply(this.canvas, i[t.toLowerCase()], e)
            }
            ,
            n.Image.prototype.blend = function() {
                n.prototype.blend.apply(this, arguments)
            }
            ,
            n.Image.prototype.save = function(t, e) {
                var r;
                if (e)
                    switch (e.toLowerCase()) {
                    case "png":
                        r = "image/png";
                        break;
                    case "jpeg":
                        r = "image/jpeg";
                        break;
                    case "jpg":
                        r = "image/jpeg";
                        break;
                    default:
                        r = "image/png"
                    }
                else
                    e = "png",
                    r = "image/png";
                var i = "image/octet-stream"
                  , o = this.canvas.toDataURL(r);
                o = o.replace(r, i),
                n.prototype.downloadFile(o, t, e)
            }
            ,
            e.exports = n.Image
        }
        , {
            "../core/core": 37,
            "./filters": 54
        }],
        58: [function(t, e, r) {
            "use strict";
            var n = t("../core/core")
              , i = t("./filters");
            t("../color/p5.Color"),
            n.prototype.pixels = [],
            n.prototype.blend = function() {
                this._renderer ? this._renderer.blend.apply(this._renderer, arguments) : n.Renderer2D.prototype.blend.apply(this, arguments)
            }
            ,
            n.prototype.copy = function() {
                n.Renderer2D._copyHelper.apply(this, arguments)
            }
            ,
            n.prototype.filter = function(t, e) {
                i.apply(this.canvas, i[t.toLowerCase()], e)
            }
            ,
            n.prototype.get = function(t, e, r, n) {
                return this._renderer.get(t, e, r, n)
            }
            ,
            n.prototype.loadPixels = function() {
                this._renderer.loadPixels()
            }
            ,
            n.prototype.set = function(t, e, r) {
                this._renderer.set(t, e, r)
            }
            ,
            n.prototype.updatePixels = function(t, e, r, n) {
                0 !== this.pixels.length && this._renderer.updatePixels(t, e, r, n)
            }
            ,
            e.exports = n
        }
        , {
            "../color/p5.Color": 31,
            "../core/core": 37,
            "./filters": 54
        }],
        59: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                var r = {};
                if (e = e || [],
                "undefined" == typeof e)
                    for (var n = 0; n < t.length; n++)
                        e[n.toString()] = n;
                for (var i = 0; i < e.length; i++) {
                    var o = e[i]
                      , s = t[i];
                    r[o] = s
                }
                return r
            }
            function i(t) {
                return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
            }
            function o(t, e) {
                e && e !== !0 && "true" !== e || (e = ""),
                t || (t = "untitled");
                var r = "";
                return t && t.indexOf(".") > -1 && (r = t.split(".").pop()),
                e && r !== e && (r = e,
                t = t + "." + r),
                [t, r]
            }
            function s(t) {
                document.body.removeChild(t.target)
            }
            var a = t("../core/core")
              , h = t("reqwest")
              , u = t("opentype.js");
            t("../core/error_helpers"),
            a._getDecrementPreload = function() {
                var t = arguments[arguments.length - 1];
                return (window.preload || this && this.preload) && "function" == typeof t ? t : null
            }
            ,
            a.prototype.loadFont = function(t, e, r) {
                var n = new a.Font(this)
                  , i = a._getDecrementPreload.apply(this, arguments);
                return u.load(t, function(o, s) {
                    if (o) {
                        if ("undefined" != typeof r && r !== i)
                            return r(o);
                        throw o
                    }
                    n.font = s,
                    "undefined" != typeof e && e(n),
                    i && e !== i && i();
                    var a, h, u = ["ttf", "otf", "woff", "woff2"], l = t.split("\\").pop().split("/").pop(), p = l.lastIndexOf("."), c = 1 > p ? null : l.substr(p + 1);
                    u.indexOf(c) > -1 && (a = l.substr(0, p),
                    h = document.createElement("style"),
                    h.appendChild(document.createTextNode("\n@font-face {\nfont-family: " + a + ";\nsrc: url(" + t + ");\n}\n")),
                    document.head.appendChild(h))
                }),
                n
            }
            ,
            a.prototype.createInput = function() {
                throw "not yet implemented"
            }
            ,
            a.prototype.createReader = function() {
                throw "not yet implemented"
            }
            ,
            a.prototype.loadBytes = function() {
                throw "not yet implemented"
            }
            ,
            a.prototype.loadJSON = function() {
                for (var t, e = arguments[0], r = arguments[1], n = a._getDecrementPreload.apply(this, arguments), i = [], o = "json", s = 2; s < arguments.length; s++) {
                    var u = arguments[s];
                    "string" == typeof u ? ("jsonp" === u || "json" === u) && (o = u) : "function" == typeof u && (t = u)
                }
                return h({
                    url: e,
                    type: o,
                    crossOrigin: !0,
                    error: function(e) {
                        t ? t(e) : console.log(e.statusText)
                    },
                    success: function(t) {
                        for (var e in t)
                            i[e] = t[e];
                        "undefined" != typeof r && r(t),
                        n && r !== n && n()
                    }
                }),
                i
            }
            ,
            a.prototype.loadStrings = function(t, e, r) {
                var n = []
                  , i = new XMLHttpRequest
                  , o = a._getDecrementPreload.apply(this, arguments);
                return i.addEventListener("error", function(t) {
                    r ? r(t) : console.log(t.responseText)
                }),
                i.open("GET", t, !0),
                i.onreadystatechange = function() {
                    if (4 === i.readyState)
                        if (200 === i.status) {
                            var t = i.responseText.match(/[^\r\n]+/g);
                            for (var s in t)
                                n[s] = t[s];
                            "undefined" != typeof e && e(n),
                            o && e !== o && o()
                        } else
                            r ? r(i) : console.log(i.statusText)
                }
                ,
                i.send(null),
                n
            }
            ,
            a.prototype.loadTable = function(t) {
                for (var e = null, r = [], i = !1, o = ",", s = !1, u = a._getDecrementPreload.apply(this, arguments), l = 1; l < arguments.length; l++)
                    if ("function" == typeof arguments[l] && arguments[l] !== u)
                        e = arguments[l];
                    else if ("string" == typeof arguments[l])
                        if (r.push(arguments[l]),
                        "header" === arguments[l] && (i = !0),
                        "csv" === arguments[l]) {
                            if (s)
                                throw new Error("Cannot set multiple separator types.");
                            o = ",",
                            s = !0
                        } else if ("tsv" === arguments[l]) {
                            if (s)
                                throw new Error("Cannot set multiple separator types.");
                            o = "	",
                            s = !0
                        }
                var p = new a.Table;
                return h({
                    url: t,
                    crossOrigin: !0,
                    type: "csv"
                }).then(function(t) {
                    t = t.responseText;
                    for (var r, s = {}, h = 0, c = 1, d = 2, f = 4, m = '"', y = "\r", g = "\n", v = [], _ = 0, x = null, b = function() {
                        s.escaped = !1,
                        x = [],
                        w()
                    }, T = function() {
                        s.currentState = f,
                        v.push(x),
                        x = null
                    }, w = function() {
                        s.currentState = h,
                        s.token = ""
                    }, S = function() {
                        x.push(s.token),
                        w()
                    }; ; ) {
                        if (r = t[_++],
                        null == r) {
                            if (s.escaped)
                                throw new Error("Unclosed quote in file.");
                            if (x) {
                                S(),
                                T();
                                break
                            }
                        }
                        if (null === x && b(),
                        s.currentState === h) {
                            if (r === m) {
                                s.escaped = !0,
                                s.currentState = c;
                                continue
                            }
                            s.currentState = c
                        }
                        s.currentState === c && s.escaped ? r === m ? t[_] === m ? (s.token += m,
                        _++) : (s.escaped = !1,
                        s.currentState = d) : s.token += r : r === y ? (t[_] === g && _++,
                        S(),
                        T()) : r === g ? (S(),
                        T()) : r === o ? S() : s.currentState === c && (s.token += r)
                    }
                    if (i)
                        p.columns = v.shift();
                    else
                        for (l = 0; l < v[0].length; l++)
                            p.columns[l] = "null";
                    var M;
                    for (l = 0; l < v.length && (l !== v.length - 1 || 1 !== v[l].length || "undefined" !== v[l][0]); l++)
                        M = new a.TableRow,
                        M.arr = v[l],
                        M.obj = n(v[l], p.columns),
                        p.addRow(M);
                    null !== e && e(p),
                    u && e !== u && u()
                }).fail(function(r, n) {
                    a._friendlyFileLoadError(2, t),
                    "undefined" != typeof e && e !== u && e(!1)
                }),
                p
            }
            ,
            a.prototype.parseXML = function(t) {
                var e, r = new a.XML;
                if (t.children.length) {
                    for (e = 0; e < t.children.length; e++) {
                        var n = parseXML(t.children[e]);
                        r.addChild(n)
                    }
                    r.setName(t.nodeName),
                    r._setCont(t.textContent),
                    r._setAttributes(t);
                    for (var i = 0; i < r.children.length; i++)
                        r.children[i].parent = r;
                    return r
                }
                return r.setName(t.nodeName),
                r._setCont(t.textContent),
                r._setAttributes(t),
                r
            }
            ,
            a.prototype.loadXML = function(t, e, r) {
                var n = {}
                  , i = a._getDecrementPreload.apply(this, arguments);
                return h({
                    url: t,
                    type: "xml",
                    crossOrigin: !0,
                    error: function(t) {
                        r ? r(t) : console.log(t.statusText)
                    }
                }).then(function(t) {
                    var r = parseXML(t.documentElement);
                    for (var o in r)
                        n[o] = r[o];
                    "undefined" != typeof e && e(n),
                    i && e !== i && i()
                }),
                n
            }
            ,
            a.prototype.selectFolder = function() {
                throw "not yet implemented"
            }
            ,
            a.prototype.selectInput = function() {
                throw "not yet implemented"
            }
            ,
            a.prototype.httpGet = function() {
                var t = Array.prototype.slice.call(arguments);
                t.push("GET"),
                a.prototype.httpDo.apply(this, t)
            }
            ,
            a.prototype.httpPost = function() {
                var t = Array.prototype.slice.call(arguments);
                t.push("POST"),
                a.prototype.httpDo.apply(this, t)
            }
            ,
            a.prototype.httpDo = function() {
                if ("object" == typeof arguments[0])
                    h(arguments[0]);
                else {
                    for (var t, e, r = "GET", n = arguments[0], i = {}, o = "", s = 1; s < arguments.length; s++) {
                        var a = arguments[s];
                        "string" == typeof a ? "GET" === a || "POST" === a || "PUT" === a ? r = a : o = a : "object" == typeof a ? i = a : "function" == typeof a && (t ? e = a : t = a)
                    }
                    "" === o && (o = -1 !== n.indexOf("json") ? "json" : -1 !== n.indexOf("xml") ? "xml" : "text"),
                    h({
                        url: n,
                        method: r,
                        data: i,
                        type: o,
                        crossOrigin: !0,
                        success: function(e) {
                            "undefined" != typeof t && t("text" === o ? e.response : e)
                        },
                        error: function(t) {
                            e ? e(t) : console.log(t.statusText)
                        }
                    })
                }
            }
            ,
            window.URL = window.URL || window.webkitURL,
            a.prototype._pWriters = [],
            a.prototype.beginRaw = function() {
                throw "not yet implemented"
            }
            ,
            a.prototype.beginRecord = function() {
                throw "not yet implemented"
            }
            ,
            a.prototype.createOutput = function() {
                throw "not yet implemented"
            }
            ,
            a.prototype.createWriter = function(t, e) {
                var r;
                for (var n in a.prototype._pWriters)
                    if (a.prototype._pWriters[n].name === t)
                        return r = new a.PrintWriter(t + window.millis(),e),
                        a.prototype._pWriters.push(r),
                        r;
                return r = new a.PrintWriter(t,e),
                a.prototype._pWriters.push(r),
                r
            }
            ,
            a.prototype.endRaw = function() {
                throw "not yet implemented"
            }
            ,
            a.prototype.endRecord = function() {
                throw "not yet implemented"
            }
            ,
            a.PrintWriter = function(t, e) {
                var r = this;
                this.name = t,
                this.content = "",
                this.print = function(t) {
                    this.content += t
                }
                ,
                this.println = function(t) {
                    this.content += t + "\n"
                }
                ,
                this.flush = function() {
                    this.content = ""
                }
                ,
                this.close = function() {
                    var n = [];
                    n.push(this.content),
                    a.prototype.writeFile(n, t, e);
                    for (var i in a.prototype._pWriters)
                        a.prototype._pWriters[i].name === this.name && a.prototype._pWriters.splice(i, 1);
                    r.flush(),
                    r = {}
                }
            }
            ,
            a.prototype.saveBytes = function() {
                throw "not yet implemented"
            }
            ,
            a.prototype.save = function(t, e, r) {
                var n = arguments
                  , i = this._curElement.elt;
                if (0 === n.length)
                    return void a.prototype.saveCanvas(i);
                if (n[0]instanceof a.Renderer || n[0]instanceof a.Graphics)
                    return void a.prototype.saveCanvas(n[0].elt, n[1], n[2]);
                if (1 === n.length && "string" == typeof n[0])
                    a.prototype.saveCanvas(i, n[0]);
                else {
                    var s = o(n[1], n[2])[1];
                    switch (s) {
                    case "json":
                        return void a.prototype.saveJSON(n[0], n[1], n[2]);
                    case "txt":
                        return void a.prototype.saveStrings(n[0], n[1], n[2]);
                    default:
                        n[0]instanceof Array ? a.prototype.saveStrings(n[0], n[1], n[2]) : n[0]instanceof a.Table ? a.prototype.saveTable(n[0], n[1], n[2], n[3]) : n[0]instanceof a.Image ? a.prototype.saveCanvas(n[0].canvas, n[1]) : n[0]instanceof a.SoundFile && a.prototype.saveSound(n[0], n[1], n[2], n[3])
                    }
                }
            }
            ,
            a.prototype.saveJSON = function(t, e, r) {
                var n;
                n = r ? JSON.stringify(t) : JSON.stringify(t, void 0, 2),
                console.log(n),
                this.saveStrings(n.split("\n"), e, "json")
            }
            ,
            a.prototype.saveJSONObject = a.prototype.saveJSON,
            a.prototype.saveJSONArray = a.prototype.saveJSON,
            a.prototype.saveStream = function() {
                throw "not yet implemented"
            }
            ,
            a.prototype.saveStrings = function(t, e, r) {
                for (var n = r || "txt", i = this.createWriter(e, n), o = 0; o < t.length; o++)
                    o < t.length - 1 ? i.println(t[o]) : i.print(t[o]);
                i.close(),
                i.flush()
            }
            ,
            a.prototype.saveXML = function() {
                throw "not yet implemented"
            }
            ,
            a.prototype.selectOutput = function() {
                throw "not yet implemented"
            }
            ,
            a.prototype.saveTable = function(t, e, r) {
                var n = this.createWriter(e, r)
                  , o = t.columns
                  , s = ",";
                if ("tsv" === r && (s = "	"),
                "html" !== r) {
                    if ("0" !== o[0])
                        for (var a = 0; a < o.length; a++)
                            a < o.length - 1 ? n.print(o[a] + s) : n.println(o[a]);
                    for (var h = 0; h < t.rows.length; h++) {
                        var u;
                        for (u = 0; u < t.rows[h].arr.length; u++)
                            u < t.rows[h].arr.length - 1 ? n.print(t.rows[h].arr[u] + s) : h < t.rows.length - 1 ? n.println(t.rows[h].arr[u]) : n.print(t.rows[h].arr[u])
                    }
                } else {
                    n.println("<html>"),
                    n.println("<head>");
                    var l = '  <meta http-equiv="content-type" content';
                    if (l += '="text/html;charset=utf-8" />',
                    n.println(l),
                    n.println("</head>"),
                    n.println("<body>"),
                    n.println("  <table>"),
                    "0" !== o[0]) {
                        n.println("    <tr>");
                        for (var p = 0; p < o.length; p++) {
                            var c = i(o[p]);
                            n.println("      <td>" + c),
                            n.println("      </td>")
                        }
                        n.println("    </tr>")
                    }
                    for (var d = 0; d < t.rows.length; d++) {
                        n.println("    <tr>");
                        for (var f = 0; f < t.columns.length; f++) {
                            var m = t.rows[d].getString(f)
                              , y = i(m);
                            n.println("      <td>" + y),
                            n.println("      </td>")
                        }
                        n.println("    </tr>")
                    }
                    n.println("  </table>"),
                    n.println("</body>"),
                    n.print("</html>")
                }
                n.close(),
                n.flush()
            }
            ,
            a.prototype.writeFile = function(t, e, r) {
                var n = "application/octet-stream";
                a.prototype._isSafari() && (n = "text/plain");
                var i = new Blob(t,{
                    type: n
                })
                  , o = window.URL.createObjectURL(i);
                a.prototype.downloadFile(o, e, r)
            }
            ,
            a.prototype.downloadFile = function(t, e, r) {
                var n = o(e, r)
                  , i = n[0]
                  , h = n[1]
                  , u = document.createElement("a");
                if (u.href = t,
                u.download = i,
                u.onclick = s,
                u.style.display = "none",
                document.body.appendChild(u),
                a.prototype._isSafari()) {
                    var l = "Hello, Safari user! To download this file...\n";
                    l += "1. Go to File --> Save As.\n",
                    l += '2. Choose "Page Source" as the Format.\n',
                    l += '3. Name it with this extension: ."' + h + '"',
                    alert(l)
                }
                u.click(),
                t = null
            }
            ,
            a.prototype._checkFileExtension = o,
            a.prototype._isSafari = function() {
                var t = Object.prototype.toString.call(window.HTMLElement);
                return t.indexOf("Constructor") > 0
            }
            ,
            e.exports = a
        }
        , {
            "../core/core": 37,
            "../core/error_helpers": 40,
            "opentype.js": 8,
            reqwest: 27
        }],
        60: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.Table = function(t) {
                this.columns = [],
                this.rows = []
            }
            ,
            n.Table.prototype.addRow = function(t) {
                var e = t || new n.TableRow;
                if ("undefined" == typeof e.arr || "undefined" == typeof e.obj)
                    throw "invalid TableRow: " + e;
                return e.table = this,
                this.rows.push(e),
                e
            }
            ,
            n.Table.prototype.removeRow = function(t) {
                this.rows[t].table = null;
                var e = this.rows.splice(t + 1, this.rows.length);
                this.rows.pop(),
                this.rows = this.rows.concat(e)
            }
            ,
            n.Table.prototype.getRow = function(t) {
                return this.rows[t]
            }
            ,
            n.Table.prototype.getRows = function() {
                return this.rows
            }
            ,
            n.Table.prototype.findRow = function(t, e) {
                if ("string" == typeof e) {
                    for (var r = 0; r < this.rows.length; r++)
                        if (this.rows[r].obj[e] === t)
                            return this.rows[r]
                } else
                    for (var n = 0; n < this.rows.length; n++)
                        if (this.rows[n].arr[e] === t)
                            return this.rows[n];
                return null
            }
            ,
            n.Table.prototype.findRows = function(t, e) {
                var r = [];
                if ("string" == typeof e)
                    for (var n = 0; n < this.rows.length; n++)
                        this.rows[n].obj[e] === t && r.push(this.rows[n]);
                else
                    for (var i = 0; i < this.rows.length; i++)
                        this.rows[i].arr[e] === t && r.push(this.rows[i]);
                return r
            }
            ,
            n.Table.prototype.matchRow = function(t, e) {
                if ("number" == typeof e) {
                    for (var r = 0; r < this.rows.length; r++)
                        if (this.rows[r].arr[e].match(t))
                            return this.rows[r]
                } else
                    for (var n = 0; n < this.rows.length; n++)
                        if (this.rows[n].obj[e].match(t))
                            return this.rows[n];
                return null
            }
            ,
            n.Table.prototype.matchRows = function(t, e) {
                var r = [];
                if ("number" == typeof e)
                    for (var n = 0; n < this.rows.length; n++)
                        this.rows[n].arr[e].match(t) && r.push(this.rows[n]);
                else
                    for (var i = 0; i < this.rows.length; i++)
                        this.rows[i].obj[e].match(t) && r.push(this.rows[i]);
                return r
            }
            ,
            n.Table.prototype.getColumn = function(t) {
                var e = [];
                if ("string" == typeof t)
                    for (var r = 0; r < this.rows.length; r++)
                        e.push(this.rows[r].obj[t]);
                else
                    for (var n = 0; n < this.rows.length; n++)
                        e.push(this.rows[n].arr[t]);
                return e
            }
            ,
            n.Table.prototype.clearRows = function() {
                delete this.rows,
                this.rows = []
            }
            ,
            n.Table.prototype.addColumn = function(t) {
                var e = t || null;
                this.columns.push(e)
            }
            ,
            n.Table.prototype.getColumnCount = function() {
                return this.columns.length
            }
            ,
            n.Table.prototype.getRowCount = function() {
                return this.rows.length
            }
            ,
            n.Table.prototype.removeTokens = function(t, e) {
                for (var r = function(t) {
                    return t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
                }, n = [], i = 0; i < t.length; i++)
                    n.push(r(t.charAt(i)));
                var o = new RegExp(n.join("|"),"g");
                if ("undefined" == typeof e)
                    for (var s = 0; s < this.columns.length; s++)
                        for (var a = 0; a < this.rows.length; a++) {
                            var h = this.rows[a].arr[s];
                            h = h.replace(o, ""),
                            this.rows[a].arr[s] = h,
                            this.rows[a].obj[this.columns[s]] = h
                        }
                else if ("string" == typeof e)
                    for (var u = 0; u < this.rows.length; u++) {
                        var l = this.rows[u].obj[e];
                        l = l.replace(o, ""),
                        this.rows[u].obj[e] = l;
                        var p = this.columns.indexOf(e);
                        this.rows[u].arr[p] = l
                    }
                else
                    for (var c = 0; c < this.rows.length; c++) {
                        var d = this.rows[c].arr[e];
                        d = d.replace(o, ""),
                        this.rows[c].arr[e] = d,
                        this.rows[c].obj[this.columns[e]] = d
                    }
            }
            ,
            n.Table.prototype.trim = function(t) {
                var e = new RegExp(" ","g");
                if ("undefined" == typeof t)
                    for (var r = 0; r < this.columns.length; r++)
                        for (var n = 0; n < this.rows.length; n++) {
                            var i = this.rows[n].arr[r];
                            i = i.replace(e, ""),
                            this.rows[n].arr[r] = i,
                            this.rows[n].obj[this.columns[r]] = i
                        }
                else if ("string" == typeof t)
                    for (var o = 0; o < this.rows.length; o++) {
                        var s = this.rows[o].obj[t];
                        s = s.replace(e, ""),
                        this.rows[o].obj[t] = s;
                        var a = this.columns.indexOf(t);
                        this.rows[o].arr[a] = s
                    }
                else
                    for (var h = 0; h < this.rows.length; h++) {
                        var u = this.rows[h].arr[t];
                        u = u.replace(e, ""),
                        this.rows[h].arr[t] = u,
                        this.rows[h].obj[this.columns[t]] = u
                    }
            }
            ,
            n.Table.prototype.removeColumn = function(t) {
                var e, r;
                "string" == typeof t ? (e = t,
                r = this.columns.indexOf(t),
                console.log("string")) : (r = t,
                e = this.columns[t]);
                var n = this.columns.splice(r + 1, this.columns.length);
                this.columns.pop(),
                this.columns = this.columns.concat(n);
                for (var i = 0; i < this.rows.length; i++) {
                    var o = this.rows[i].arr
                      , s = o.splice(r + 1, o.length);
                    o.pop(),
                    this.rows[i].arr = o.concat(s),
                    delete this.rows[i].obj[e]
                }
            }
            ,
            n.Table.prototype.set = function(t, e, r) {
                this.rows[t].set(e, r)
            }
            ,
            n.Table.prototype.setNum = function(t, e, r) {
                this.rows[t].setNum(e, r)
            }
            ,
            n.Table.prototype.setString = function(t, e, r) {
                this.rows[t].setString(e, r)
            }
            ,
            n.Table.prototype.get = function(t, e) {
                return this.rows[t].get(e)
            }
            ,
            n.Table.prototype.getNum = function(t, e) {
                return this.rows[t].getNum(e)
            }
            ,
            n.Table.prototype.getString = function(t, e) {
                return this.rows[t].getString(e)
            }
            ,
            n.Table.prototype.getObject = function(t) {
                for (var e, r, n, i = {}, o = 0; o < this.rows.length; o++)
                    if (e = this.rows[o].obj,
                    "string" == typeof t) {
                        if (r = this.columns.indexOf(t),
                        !(r >= 0))
                            throw 'This table has no column named "' + t + '"';
                        n = e[t],
                        i[n] = e
                    } else
                        i[o] = this.rows[o].obj;
                return i
            }
            ,
            n.Table.prototype.getArray = function() {
                for (var t = [], e = 0; e < this.rows.length; e++)
                    t.push(this.rows[e].arr);
                return t
            }
            ,
            e.exports = n.Table
        }
        , {
            "../core/core": 37
        }],
        61: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.TableRow = function(t, e) {
                var r = []
                  , n = {};
                t && (e = e || ",",
                r = t.split(e));
                for (var i = 0; i < r.length; i++) {
                    var o = i
                      , s = r[i];
                    n[o] = s
                }
                this.arr = r,
                this.obj = n,
                this.table = null
            }
            ,
            n.TableRow.prototype.set = function(t, e) {
                if ("string" == typeof t) {
                    var r = this.table.columns.indexOf(t);
                    if (!(r >= 0))
                        throw 'This table has no column named "' + t + '"';
                    this.obj[t] = e,
                    this.arr[r] = e
                } else {
                    if (!(t < this.table.columns.length))
                        throw "Column #" + t + " is out of the range of this table";
                    this.arr[t] = e;
                    var n = this.table.columns[t];
                    this.obj[n] = e
                }
            }
            ,
            n.TableRow.prototype.setNum = function(t, e) {
                var r = parseFloat(e, 10);
                this.set(t, r)
            }
            ,
            n.TableRow.prototype.setString = function(t, e) {
                var r = e.toString();
                this.set(t, r)
            }
            ,
            n.TableRow.prototype.get = function(t) {
                return "string" == typeof t ? this.obj[t] : this.arr[t]
            }
            ,
            n.TableRow.prototype.getNum = function(t) {
                var e;
                if (e = "string" == typeof t ? parseFloat(this.obj[t], 10) : parseFloat(this.arr[t], 10),
                "NaN" === e.toString())
                    throw "Error: " + this.obj[t] + " is NaN (Not a Number)";
                return e
            }
            ,
            n.TableRow.prototype.getString = function(t) {
                return "string" == typeof t ? this.obj[t].toString() : this.arr[t].toString()
            }
            ,
            e.exports = n.TableRow
        }
        , {
            "../core/core": 37
        }],
        62: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.XML = function() {
                this.name = null,
                this.attributes = {},
                this.children = [],
                this.parent = null,
                this.content = null
            }
            ,
            n.XML.prototype.getParent = function() {
                return this.parent
            }
            ,
            n.XML.prototype.getName = function() {
                return this.name
            }
            ,
            n.XML.prototype.setName = function(t) {
                this.name = t
            }
            ,
            n.XML.prototype.hasChildren = function() {
                return this.children.length > 0
            }
            ,
            n.XML.prototype.listChildren = function() {
                return this.children.map(function(t) {
                    return t.name
                })
            }
            ,
            n.XML.prototype.getChildren = function(t) {
                return t ? this.children.filter(function(e) {
                    return e.name === t
                }) : this.children
            }
            ,
            n.XML.prototype.getChild = function(t) {
                return "string" == typeof t ? this.children.find(function(e) {
                    return e.name === t
                }) : this.children[t]
            }
            ,
            n.XML.prototype.addChild = function(t) {
                t instanceof n.XML && this.children.push(t)
            }
            ,
            n.XML.prototype.removeChild = function(t) {
                var e = -1;
                if ("string" == typeof t) {
                    for (var r = 0; r < this.children.length; r++)
                        if (this.children[r].name === t) {
                            e = r;
                            break
                        }
                } else
                    e = t;
                -1 !== e && this.children.splice(e, 1)
            }
            ,
            n.XML.prototype.getAttributeCount = function() {
                return Object.keys(this.attributes).length
            }
            ,
            n.XML.prototype.listAttributes = function() {
                return Object.keys(this.attributes)
            }
            ,
            n.XML.prototype.hasAttribute = function(t) {
                return !!this.attributes[t]
            }
            ,
            n.XML.prototype.getNumber = function(t, e) {
                return Number(this.attributes[t]) || e || 0
            }
            ,
            n.XML.prototype.getString = function(t, e) {
                return String(this.attributes[t]) || e || null
            }
            ,
            n.XML.prototype.setAttribute = function(t, e) {
                this.attributes[t] && (this.attributes[t] = e)
            }
            ,
            n.XML.prototype.getContent = function(t) {
                return this.content || t || null
            }
            ,
            n.XML.prototype.setContent = function(t) {
                this.children.length || (this.content = t)
            }
            ,
            n.XML.prototype._setCont = function(t) {
                var e;
                e = t,
                e = e.replace(/\s\s+/g, ","),
                this.content = e
            }
            ,
            n.XML.prototype._setAttributes = function(t) {
                var e, r = {};
                for (e = 0; e < t.attributes.length; e++)
                    r[t.attributes[e].nodeName] = t.attributes[e].nodeValue;
                this.attributes = r
            }
            ,
            e.exports = n.XML
        }
        , {
            "../core/core": 37
        }],
        63: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.prototype.abs = Math.abs,
            n.prototype.ceil = Math.ceil,
            n.prototype.constrain = function(t, e, r) {
                return Math.max(Math.min(t, r), e)
            }
            ,
            n.prototype.dist = function(t, e, r, n, i, o) {
                return 4 === arguments.length ? Math.sqrt((r - t) * (r - t) + (n - e) * (n - e)) : 6 === arguments.length ? Math.sqrt((n - t) * (n - t) + (i - e) * (i - e) + (o - r) * (o - r)) : void 0
            }
            ,
            n.prototype.exp = Math.exp,
            n.prototype.floor = Math.floor,
            n.prototype.lerp = function(t, e, r) {
                return r * (e - t) + t
            }
            ,
            n.prototype.log = Math.log,
            n.prototype.mag = function(t, e) {
                return Math.sqrt(t * t + e * e)
            }
            ,
            n.prototype.map = function(t, e, r, n, i) {
                return (t - e) / (r - e) * (i - n) + n
            }
            ,
            n.prototype.max = function() {
                return arguments[0]instanceof Array ? Math.max.apply(null, arguments[0]) : Math.max.apply(null, arguments)
            }
            ,
            n.prototype.min = function() {
                return arguments[0]instanceof Array ? Math.min.apply(null, arguments[0]) : Math.min.apply(null, arguments)
            }
            ,
            n.prototype.norm = function(t, e, r) {
                return this.map(t, e, r, 0, 1)
            }
            ,
            n.prototype.pow = Math.pow,
            n.prototype.round = Math.round,
            n.prototype.sq = function(t) {
                return t * t
            }
            ,
            n.prototype.sqrt = Math.sqrt,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        64: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.prototype.createVector = function(t, e, r) {
                return this instanceof n ? new n.Vector(this,arguments) : new n.Vector(t,e,r)
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        65: [function(t, e, r) {
            "use strict";
            var n, i = t("../core/core"), o = 4, s = 1 << o, a = 8, h = 1 << a, u = 4095, l = 4, p = .5, c = function(t) {
                return .5 * (1 - Math.cos(t * Math.PI))
            };
            i.prototype.noise = function(t, e, r) {
                if (e = e || 0,
                r = r || 0,
                null == n) {
                    n = new Array(u + 1);
                    for (var i = 0; u + 1 > i; i++)
                        n[i] = Math.random()
                }
                0 > t && (t = -t),
                0 > e && (e = -e),
                0 > r && (r = -r);
                for (var d, f, m, y, g, v = Math.floor(t), _ = Math.floor(e), x = Math.floor(r), b = t - v, T = e - _, w = r - x, S = 0, M = .5, A = 0; l > A; A++) {
                    var C = v + (_ << o) + (x << a);
                    d = c(b),
                    f = c(T),
                    m = n[C & u],
                    m += d * (n[C + 1 & u] - m),
                    y = n[C + s & u],
                    y += d * (n[C + s + 1 & u] - y),
                    m += f * (y - m),
                    C += h,
                    y = n[C & u],
                    y += d * (n[C + 1 & u] - y),
                    g = n[C + s & u],
                    g += d * (n[C + s + 1 & u] - g),
                    y += f * (g - y),
                    m += c(w) * (y - m),
                    S += m * M,
                    M *= p,
                    v <<= 1,
                    b *= 2,
                    _ <<= 1,
                    T *= 2,
                    x <<= 1,
                    w *= 2,
                    b >= 1 && (v++,
                    b--),
                    T >= 1 && (_++,
                    T--),
                    w >= 1 && (x++,
                    w--)
                }
                return S
            }
            ,
            i.prototype.noiseDetail = function(t, e) {
                t > 0 && (l = t),
                e > 0 && (p = e)
            }
            ,
            i.prototype.noiseSeed = function(t) {
                var e = function() {
                    var t, e, r = 4294967296, n = 1664525, i = 1013904223;
                    return {
                        setSeed: function(n) {
                            e = t = (null == n ? Math.random() * r : n) >>> 0
                        },
                        getSeed: function() {
                            return t
                        },
                        rand: function() {
                            return e = (n * e + i) % r,
                            e / r
                        }
                    }
                }();
                e.setSeed(t),
                n = new Array(u + 1);
                for (var r = 0; u + 1 > r; r++)
                    n[r] = e.rand()
            }
            ,
            e.exports = i
        }
        , {
            "../core/core": 37
        }],
        66: [function(t, e, r) {
            "use strict";
            var n = t("../core/core")
              , i = t("./polargeometry")
              , o = t("../core/constants");
            n.Vector = function() {
                var t, e, r;
                arguments[0]instanceof n ? (this.p5 = arguments[0],
                t = arguments[1][0] || 0,
                e = arguments[1][1] || 0,
                r = arguments[1][2] || 0) : (t = arguments[0] || 0,
                e = arguments[1] || 0,
                r = arguments[2] || 0),
                this.x = t,
                this.y = e,
                this.z = r
            }
            ,
            n.Vector.prototype.toString = function() {
                return "p5.Vector Object : [" + this.x + ", " + this.y + ", " + this.z + "]"
            }
            ,
            n.Vector.prototype.set = function(t, e, r) {
                return t instanceof n.Vector ? (this.x = t.x || 0,
                this.y = t.y || 0,
                this.z = t.z || 0,
                this) : t instanceof Array ? (this.x = t[0] || 0,
                this.y = t[1] || 0,
                this.z = t[2] || 0,
                this) : (this.x = t || 0,
                this.y = e || 0,
                this.z = r || 0,
                this)
            }
            ,
            n.Vector.prototype.copy = function() {
                return this.p5 ? new n.Vector(this.p5,[this.x, this.y, this.z]) : new n.Vector(this.x,this.y,this.z)
            }
            ,
            n.Vector.prototype.add = function(t, e, r) {
                return t instanceof n.Vector ? (this.x += t.x || 0,
                this.y += t.y || 0,
                this.z += t.z || 0,
                this) : t instanceof Array ? (this.x += t[0] || 0,
                this.y += t[1] || 0,
                this.z += t[2] || 0,
                this) : (this.x += t || 0,
                this.y += e || 0,
                this.z += r || 0,
                this)
            }
            ,
            n.Vector.prototype.sub = function(t, e, r) {
                return t instanceof n.Vector ? (this.x -= t.x || 0,
                this.y -= t.y || 0,
                this.z -= t.z || 0,
                this) : t instanceof Array ? (this.x -= t[0] || 0,
                this.y -= t[1] || 0,
                this.z -= t[2] || 0,
                this) : (this.x -= t || 0,
                this.y -= e || 0,
                this.z -= r || 0,
                this)
            }
            ,
            n.Vector.prototype.mult = function(t) {
                return this.x *= t || 0,
                this.y *= t || 0,
                this.z *= t || 0,
                this
            }
            ,
            n.Vector.prototype.div = function(t) {
                return this.x /= t,
                this.y /= t,
                this.z /= t,
                this
            }
            ,
            n.Vector.prototype.mag = function() {
                return Math.sqrt(this.magSq())
            }
            ,
            n.Vector.prototype.magSq = function() {
                var t = this.x
                  , e = this.y
                  , r = this.z;
                return t * t + e * e + r * r
            }
            ,
            n.Vector.prototype.dot = function(t, e, r) {
                return t instanceof n.Vector ? this.dot(t.x, t.y, t.z) : this.x * (t || 0) + this.y * (e || 0) + this.z * (r || 0)
            }
            ,
            n.Vector.prototype.cross = function(t) {
                var e = this.y * t.z - this.z * t.y
                  , r = this.z * t.x - this.x * t.z
                  , i = this.x * t.y - this.y * t.x;
                return this.p5 ? new n.Vector(this.p5,[e, r, i]) : new n.Vector(e,r,i)
            }
            ,
            n.Vector.prototype.dist = function(t) {
                var e = t.copy().sub(this);
                return e.mag()
            }
            ,
            n.Vector.prototype.normalize = function() {
                return this.div(this.mag())
            }
            ,
            n.Vector.prototype.limit = function(t) {
                var e = this.magSq();
                return e > t * t && (this.div(Math.sqrt(e)),
                this.mult(t)),
                this
            }
            ,
            n.Vector.prototype.setMag = function(t) {
                return this.normalize().mult(t)
            }
            ,
            n.Vector.prototype.heading = function() {
                var t = Math.atan2(this.y, this.x);
                return this.p5 ? this.p5._angleMode === o.RADIANS ? t : i.radiansToDegrees(t) : t
            }
            ,
            n.Vector.prototype.rotate = function(t) {
                this.p5 && this.p5._angleMode === o.DEGREES && (t = i.degreesToRadians(t));
                var e = this.heading() + t
                  , r = this.mag();
                return this.x = Math.cos(e) * r,
                this.y = Math.sin(e) * r,
                this
            }
            ,
            n.Vector.prototype.lerp = function(t, e, r, i) {
                return t instanceof n.Vector ? this.lerp(t.x, t.y, t.z, e) : (this.x += (t - this.x) * i || 0,
                this.y += (e - this.y) * i || 0,
                this.z += (r - this.z) * i || 0,
                this)
            }
            ,
            n.Vector.prototype.array = function() {
                return [this.x || 0, this.y || 0, this.z || 0]
            }
            ,
            n.Vector.prototype.equals = function(t, e, r) {
                var i, o, s;
                return t instanceof n.Vector ? (i = t.x || 0,
                o = t.y || 0,
                s = t.z || 0) : t instanceof Array ? (i = t[0] || 0,
                o = t[1] || 0,
                s = t[2] || 0) : (i = t || 0,
                o = e || 0,
                s = r || 0),
                this.x === i && this.y === o && this.z === s
            }
            ,
            n.Vector.fromAngle = function(t) {
                return this.p5 && this.p5._angleMode === o.DEGREES && (t = i.degreesToRadians(t)),
                this.p5 ? new n.Vector(this.p5,[Math.cos(t), Math.sin(t), 0]) : new n.Vector(Math.cos(t),Math.sin(t),0)
            }
            ,
            n.Vector.random2D = function() {
                var t;
                return t = this.p5 ? this.p5._angleMode === o.DEGREES ? this.p5.random(360) : this.p5.random(o.TWO_PI) : Math.random() * Math.PI * 2,
                this.fromAngle(t)
            }
            ,
            n.Vector.random3D = function() {
                var t, e;
                this.p5 ? (t = this.p5.random(0, o.TWO_PI),
                e = this.p5.random(-1, 1)) : (t = Math.random() * Math.PI * 2,
                e = 2 * Math.random() - 1);
                var r = Math.sqrt(1 - e * e) * Math.cos(t)
                  , i = Math.sqrt(1 - e * e) * Math.sin(t);
                return this.p5 ? new n.Vector(this.p5,[r, i, e]) : new n.Vector(r,i,e)
            }
            ,
            n.Vector.add = function(t, e, r) {
                return r ? r.set(t) : r = t.copy(),
                r.add(e),
                r
            }
            ,
            n.Vector.sub = function(t, e, r) {
                return r ? r.set(t) : r = t.copy(),
                r.sub(e),
                r
            }
            ,
            n.Vector.mult = function(t, e, r) {
                return r ? r.set(t) : r = t.copy(),
                r.mult(e),
                r
            }
            ,
            n.Vector.div = function(t, e, r) {
                return r ? r.set(t) : r = t.copy(),
                r.div(e),
                r
            }
            ,
            n.Vector.dot = function(t, e) {
                return t.dot(e)
            }
            ,
            n.Vector.cross = function(t, e) {
                return t.cross(e)
            }
            ,
            n.Vector.dist = function(t, e) {
                return t.dist(e)
            }
            ,
            n.Vector.lerp = function(t, e, r, n) {
                return n ? n.set(t) : n = t.copy(),
                n.lerp(e, r),
                n
            }
            ,
            n.Vector.angleBetween = function(t, e) {
                var r = Math.acos(t.dot(e) / (t.mag() * e.mag()));
                return this.p5 && this.p5._angleMode === o.DEGREES && (r = i.radiansToDegrees(r)),
                r
            }
            ,
            n.Vector.mag = function(t) {
                var e = t.x
                  , r = t.y
                  , n = t.z
                  , i = e * e + r * r + n * n;
                return Math.sqrt(i)
            }
            ,
            e.exports = n.Vector
        }
        , {
            "../core/constants": 36,
            "../core/core": 37,
            "./polargeometry": 67
        }],
        67: [function(t, e, r) {
            e.exports = {
                degreesToRadians: function(t) {
                    return 2 * Math.PI * t / 360
                },
                radiansToDegrees: function(t) {
                    return 360 * t / (2 * Math.PI)
                }
            }
        }
        , {}],
        68: [function(t, e, r) {
            "use strict";
            var n = t("../core/core")
              , i = !1
              , o = function() {
                var t, e, r = 4294967296, n = 1664525, i = 1013904223;
                return {
                    setSeed: function(n) {
                        e = t = (null == n ? Math.random() * r : n) >>> 0
                    },
                    getSeed: function() {
                        return t
                    },
                    rand: function() {
                        return e = (n * e + i) % r,
                        e / r
                    }
                }
            }();
            n.prototype.randomSeed = function(t) {
                o.setSeed(t),
                i = !0
            }
            ,
            n.prototype.random = function(t, e) {
                var r;
                if (r = i ? o.rand() : Math.random(),
                0 === arguments.length)
                    return r;
                if (1 === arguments.length)
                    return r * t;
                if (t > e) {
                    var n = t;
                    t = e,
                    e = n
                }
                return r * (e - t) + t
            }
            ;
            var s, a = !1;
            n.prototype.randomGaussian = function(t, e) {
                var r, n, i, o;
                if (a)
                    r = s,
                    a = !1;
                else {
                    do
                        n = this.random(2) - 1,
                        i = this.random(2) - 1,
                        o = n * n + i * i;
                    while (o >= 1);
                    o = Math.sqrt(-2 * Math.log(o) / o),
                    r = n * o,
                    s = i * o,
                    a = !0
                }
                var h = t || 0
                  , u = e || 1;
                return r * u + h
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        69: [function(t, e, r) {
            "use strict";
            var n = t("../core/core")
              , i = t("./polargeometry")
              , o = t("../core/constants");
            n.prototype._angleMode = o.RADIANS,
            n.prototype.acos = function(t) {
                return this._angleMode === o.RADIANS ? Math.acos(t) : i.radiansToDegrees(Math.acos(t))
            }
            ,
            n.prototype.asin = function(t) {
                return this._angleMode === o.RADIANS ? Math.asin(t) : i.radiansToDegrees(Math.asin(t))
            }
            ,
            n.prototype.atan = function(t) {
                return this._angleMode === o.RADIANS ? Math.atan(t) : i.radiansToDegrees(Math.atan(t))
            }
            ,
            n.prototype.atan2 = function(t, e) {
                return this._angleMode === o.RADIANS ? Math.atan2(t, e) : i.radiansToDegrees(Math.atan2(t, e))
            }
            ,
            n.prototype.cos = function(t) {
                return this._angleMode === o.RADIANS ? Math.cos(t) : Math.cos(this.radians(t))
            }
            ,
            n.prototype.sin = function(t) {
                return this._angleMode === o.RADIANS ? Math.sin(t) : Math.sin(this.radians(t))
            }
            ,
            n.prototype.tan = function(t) {
                return this._angleMode === o.RADIANS ? Math.tan(t) : Math.tan(this.radians(t))
            }
            ,
            n.prototype.degrees = function(t) {
                return i.radiansToDegrees(t)
            }
            ,
            n.prototype.radians = function(t) {
                return i.degreesToRadians(t)
            }
            ,
            n.prototype.angleMode = function(t) {
                (t === o.DEGREES || t === o.RADIANS) && (this._angleMode = t)
            }
            ,
            e.exports = n
        }
        , {
            "../core/constants": 36,
            "../core/core": 37,
            "./polargeometry": 67
        }],
        70: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.prototype.textAlign = function(t, e) {
                return this._renderer.textAlign.apply(this._renderer, arguments)
            }
            ,
            n.prototype.textLeading = function(t) {
                return this._renderer.textLeading.apply(this._renderer, arguments)
            }
            ,
            n.prototype.textSize = function(t) {
                return this._renderer.textSize.apply(this._renderer, arguments)
            }
            ,
            n.prototype.textStyle = function(t) {
                return this._renderer.textStyle.apply(this._renderer, arguments)
            }
            ,
            n.prototype.textWidth = function(t) {
                return this._renderer.textWidth.apply(this._renderer, arguments)
            }
            ,
            n.prototype.textAscent = function() {
                return this._renderer.textAscent()
            }
            ,
            n.prototype.textDescent = function() {
                return this._renderer.textDescent()
            }
            ,
            n.prototype._updateTextMetrics = function() {
                return this._renderer._updateTextMetrics()
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        71: [function(t, e, r) {
            "use strict";
            var n = t("../core/core")
              , i = t("../core/constants");
            t("../core/error_helpers"),
            n.prototype.text = function(t, e, r, n, i) {
                for (var o = new Array(arguments.length), s = 0; s < o.length; ++s)
                    o[s] = arguments[s];
                return this._validateParameters("text", o, [["*", "Number", "Number"], ["*", "Number", "Number", "Number", "Number"]]),
                this._renderer._doFill || this._renderer._doStroke ? this._renderer.text.apply(this._renderer, arguments) : this
            }
            ,
            n.prototype.textFont = function(t, e) {
                if (arguments.length) {
                    if (!t)
                        throw Error("null font passed to textFont");
                    return this._renderer._setProperty("_textFont", t),
                    e && (this._renderer._setProperty("_textSize", e),
                    this._renderer._setProperty("_textLeading", e * i._DEFAULT_LEADMULT)),
                    this._renderer._applyTextProperties()
                }
                return this
            }
            ,
            e.exports = n
        }
        , {
            "../core/constants": 36,
            "../core/core": 37,
            "../core/error_helpers": 40
        }],
        72: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                for (var r = a(e, {
                    sampleFactor: .1,
                    simplifyThreshold: 0
                }), n = d(t, 0, 1), o = n / (n * r.sampleFactor), s = [], h = 0; n > h; h += o)
                    s.push(d(t, h));
                return r.simplifyThreshold && i(s, r.simplifyThreshold),
                s
            }
            function i(t, e) {
                e = "undefined" == typeof e ? 0 : e;
                for (var r = 0, n = t.length - 1; t.length > 3 && n >= 0; --n)
                    u(h(t, n - 1), h(t, n), h(t, n + 1), e) && (t.splice(n % t.length, 1),
                    r++);
                return r
            }
            function o(t) {
                for (var e, r = [], n = 0; n < t.length; n++)
                    "M" === t[n].type && (e && r.push(e),
                    e = []),
                    e.push(s(t[n]));
                return r.push(e),
                r
            }
            function s(t) {
                var e = [t.type];
                return "M" === t.type || "L" === t.type ? e.push(t.x, t.y) : "C" === t.type ? e.push(t.x1, t.y1, t.x2, t.y2, t.x, t.y) : "Q" === t.type && e.push(t.x1, t.y1, t.x, t.y),
                e
            }
            function a(t, e) {
                if ("object" != typeof t)
                    t = e;
                else
                    for (var r in e)
                        "undefined" == typeof t[r] && (t[r] = e[r]);
                return t
            }
            function h(t, e) {
                var r = t.length;
                return t[0 > e ? e % r + r : e % r]
            }
            function u(t, e, r, n) {
                if (!n)
                    return 0 === l(t, e, r);
                "undefined" == typeof u.tmpPoint1 && (u.tmpPoint1 = [],
                u.tmpPoint2 = []);
                var i = u.tmpPoint1
                  , o = u.tmpPoint2;
                i.x = e.x - t.x,
                i.y = e.y - t.y,
                o.x = r.x - e.x,
                o.y = r.y - e.y;
                var s = i.x * o.x + i.y * o.y
                  , a = Math.sqrt(i.x * i.x + i.y * i.y)
                  , h = Math.sqrt(o.x * o.x + o.y * o.y)
                  , p = Math.acos(s / (a * h));
                return n > p
            }
            function l(t, e, r) {
                return (e[0] - t[0]) * (r[1] - t[1]) - (r[0] - t[0]) * (e[1] - t[1])
            }
            function p(t, e, r, n, i, o, s, a, h) {
                var u = 1 - h
                  , l = Math.pow(u, 3)
                  , p = Math.pow(u, 2)
                  , c = h * h
                  , d = c * h
                  , f = l * t + 3 * p * h * r + 3 * u * h * h * i + d * s
                  , m = l * e + 3 * p * h * n + 3 * u * h * h * o + d * a
                  , y = t + 2 * h * (r - t) + c * (i - 2 * r + t)
                  , g = e + 2 * h * (n - e) + c * (o - 2 * n + e)
                  , v = r + 2 * h * (i - r) + c * (s - 2 * i + r)
                  , _ = n + 2 * h * (o - n) + c * (a - 2 * o + n)
                  , x = u * t + h * r
                  , b = u * e + h * n
                  , T = u * i + h * s
                  , w = u * o + h * a
                  , S = 90 - 180 * Math.atan2(y - v, g - _) / Math.PI;
                return (y > v || _ > g) && (S += 180),
                {
                    x: f,
                    y: m,
                    m: {
                        x: y,
                        y: g
                    },
                    n: {
                        x: v,
                        y: _
                    },
                    start: {
                        x: x,
                        y: b
                    },
                    end: {
                        x: T,
                        y: w
                    },
                    alpha: S
                }
            }
            function c(t, e, r, n, i, o, s, a, h) {
                return null == h ? x(t, e, r, n, i, o, s, a) : p(t, e, r, n, i, o, s, a, b(t, e, r, n, i, o, s, a, h))
            }
            function d(t, e, r) {
                t = m(t);
                for (var n, i, o, s, a, h = "", u = {}, l = 0, d = 0, f = t.length; f > d; d++) {
                    if (o = t[d],
                    "M" === o[0])
                        n = +o[1],
                        i = +o[2];
                    else {
                        if (s = c(n, i, o[1], o[2], o[3], o[4], o[5], o[6]),
                        l + s > e && !r)
                            return a = c(n, i, o[1], o[2], o[3], o[4], o[5], o[6], e - l),
                            {
                                x: a.x,
                                y: a.y,
                                alpha: a.alpha
                            };
                        l += s,
                        n = +o[5],
                        i = +o[6]
                    }
                    h += o.shift() + o
                }
                return u.end = h,
                a = r ? l : p(n, i, o[0], o[1], o[2], o[3], o[4], o[5], 1),
                a.alpha && (a = {
                    x: a.x,
                    y: a.y,
                    alpha: a.alpha
                }),
                a
            }
            function f(t) {
                var e = []
                  , r = 0
                  , n = 0
                  , i = 0
                  , o = 0
                  , s = 0;
                "M" === t[0][0] && (r = +t[0][1],
                n = +t[0][2],
                i = r,
                o = n,
                s++,
                e[0] = ["M", r, n]);
                for (var a, h, u, l = 3 === t.length && "M" === t[0][0] && "R" === t[1][0].toUpperCase() && "Z" === t[2][0].toUpperCase(), p = s, c = t.length; c > p; p++) {
                    if (e.push(h = []),
                    u = t[p],
                    u[0] !== String.prototype.toUpperCase.call(u[0]))
                        switch (h[0] = String.prototype.toUpperCase.call(u[0]),
                        h[0]) {
                        case "A":
                            h[1] = u[1],
                            h[2] = u[2],
                            h[3] = u[3],
                            h[4] = u[4],
                            h[5] = u[5],
                            h[6] = +(u[6] + r),
                            h[7] = +(u[7] + n);
                            break;
                        case "V":
                            h[1] = +u[1] + n;
                            break;
                        case "H":
                            h[1] = +u[1] + r;
                            break;
                        case "R":
                            a = [r, n].concat(u.slice(1));
                            for (var d = 2, f = a.length; f > d; d++)
                                a[d] = +a[d] + r,
                                a[++d] = +a[d] + n;
                            e.pop(),
                            e = e.concat(g(a, l));
                            break;
                        case "M":
                            i = +u[1] + r,
                            o = +u[2] + n;
                            break;
                        default:
                            for (d = 1,
                            f = u.length; f > d; d++)
                                h[d] = +u[d] + (d % 2 ? r : n)
                        }
                    else if ("R" === u[0])
                        a = [r, n].concat(u.slice(1)),
                        e.pop(),
                        e = e.concat(g(a, l)),
                        h = ["R"].concat(u.slice(-2));
                    else
                        for (var m = 0, y = u.length; y > m; m++)
                            h[m] = u[m];
                    switch (h[0]) {
                    case "Z":
                        r = i,
                        n = o;
                        break;
                    case "H":
                        r = h[1];
                        break;
                    case "V":
                        n = h[1];
                        break;
                    case "M":
                        i = h[h.length - 2],
                        o = h[h.length - 1];
                        break;
                    default:
                        r = h[h.length - 2],
                        n = h[h.length - 1]
                    }
                }
                return e
            }
            function m(t, e) {
                for (var r = f(t), n = e && f(e), i = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null
                }, o = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null
                }, s = (function(t, e, r) {
                    var n, i, o = {
                        T: 1,
                        Q: 1
                    };
                    if (!t)
                        return ["C", e.x, e.y, e.x, e.y, e.x, e.y];
                    switch (t[0]in o || (e.qx = e.qy = null),
                    t[0]) {
                    case "M":
                        e.X = t[1],
                        e.Y = t[2];
                        break;
                    case "A":
                        t = ["C"].concat(y.apply(0, [e.x, e.y].concat(t.slice(1))));
                        break;
                    case "S":
                        "C" === r || "S" === r ? (n = 2 * e.x - e.bx,
                        i = 2 * e.y - e.by) : (n = e.x,
                        i = e.y),
                        t = ["C", n, i].concat(t.slice(1));
                        break;
                    case "T":
                        "Q" === r || "T" === r ? (e.qx = 2 * e.x - e.qx,
                        e.qy = 2 * e.y - e.qy) : (e.qx = e.x,
                        e.qy = e.y),
                        t = ["C"].concat(_(e.x, e.y, e.qx, e.qy, t[1], t[2]));
                        break;
                    case "Q":
                        e.qx = t[1],
                        e.qy = t[2],
                        t = ["C"].concat(_(e.x, e.y, t[1], t[2], t[3], t[4]));
                        break;
                    case "L":
                        t = ["C"].concat(v(e.x, e.y, t[1], t[2]));
                        break;
                    case "H":
                        t = ["C"].concat(v(e.x, e.y, t[1], e.y));
                        break;
                    case "V":
                        t = ["C"].concat(v(e.x, e.y, e.x, t[1]));
                        break;
                    case "Z":
                        t = ["C"].concat(v(e.x, e.y, e.X, e.Y))
                    }
                    return t
                }
                ), a = function(t, e) {
                    if (t[e].length > 7) {
                        t[e].shift();
                        for (var i = t[e]; i.length; )
                            u[e] = "A",
                            n && (l[e] = "A"),
                            t.splice(e++, 0, ["C"].concat(i.splice(0, 6)));
                        t.splice(e, 1),
                        m = Math.max(r.length, n && n.length || 0)
                    }
                }, h = function(t, e, i, o, s) {
                    t && e && "M" === t[s][0] && "M" !== e[s][0] && (e.splice(s, 0, ["M", o.x, o.y]),
                    i.bx = 0,
                    i.by = 0,
                    i.x = t[s][1],
                    i.y = t[s][2],
                    m = Math.max(r.length, n && n.length || 0))
                }, u = [], l = [], p = "", c = "", d = 0, m = Math.max(r.length, n && n.length || 0); m > d; d++) {
                    r[d] && (p = r[d][0]),
                    "C" !== p && (u[d] = p,
                    d && (c = u[d - 1])),
                    r[d] = s(r[d], i, c),
                    "A" !== u[d] && "C" === p && (u[d] = "C"),
                    a(r, d),
                    n && (n[d] && (p = n[d][0]),
                    "C" !== p && (l[d] = p,
                    d && (c = l[d - 1])),
                    n[d] = s(n[d], o, c),
                    "A" !== l[d] && "C" === p && (l[d] = "C"),
                    a(n, d)),
                    h(r, n, i, o, d),
                    h(n, r, o, i, d);
                    var g = r[d]
                      , x = n && n[d]
                      , b = g.length
                      , T = n && x.length;
                    i.x = g[b - 2],
                    i.y = g[b - 1],
                    i.bx = parseFloat(g[b - 4]) || i.x,
                    i.by = parseFloat(g[b - 3]) || i.y,
                    o.bx = n && (parseFloat(x[T - 4]) || o.x),
                    o.by = n && (parseFloat(x[T - 3]) || o.y),
                    o.x = n && x[T - 2],
                    o.y = n && x[T - 1]
                }
                return n ? [r, n] : r
            }
            function y(t, e, r, n, i, o, s, a, h, u) {
                var l, p, c, d, f, m = Math.PI, g = 120 * m / 180, v = m / 180 * (+i || 0), _ = [], x = function(t, e, r) {
                    var n = t * Math.cos(r) - e * Math.sin(r)
                      , i = t * Math.sin(r) + e * Math.cos(r);
                    return {
                        x: n,
                        y: i
                    }
                };
                if (u)
                    l = u[0],
                    p = u[1],
                    c = u[2],
                    d = u[3];
                else {
                    f = x(t, e, -v),
                    t = f.x,
                    e = f.y,
                    f = x(a, h, -v),
                    a = f.x,
                    h = f.y;
                    var b = (t - a) / 2
                      , T = (e - h) / 2
                      , w = b * b / (r * r) + T * T / (n * n);
                    w > 1 && (w = Math.sqrt(w),
                    r = w * r,
                    n = w * n);
                    var S = r * r
                      , M = n * n
                      , A = (o === s ? -1 : 1) * Math.sqrt(Math.abs((S * M - S * T * T - M * b * b) / (S * T * T + M * b * b)));
                    c = A * r * T / n + (t + a) / 2,
                    d = A * -n * b / r + (e + h) / 2,
                    l = Math.asin(((e - d) / n).toFixed(9)),
                    p = Math.asin(((h - d) / n).toFixed(9)),
                    l = c > t ? m - l : l,
                    p = c > a ? m - p : p,
                    0 > l && (l = 2 * m + l),
                    0 > p && (p = 2 * m + p),
                    s && l > p && (l -= 2 * m),
                    !s && p > l && (p -= 2 * m)
                }
                var C = p - l;
                if (Math.abs(C) > g) {
                    var R = p
                      , E = a
                      , P = h;
                    p = l + g * (s && p > l ? 1 : -1),
                    a = c + r * Math.cos(p),
                    h = d + n * Math.sin(p),
                    _ = y(a, h, r, n, i, 0, s, E, P, [p, R, c, d])
                }
                C = p - l;
                var N = Math.cos(l)
                  , O = Math.sin(l)
                  , k = Math.cos(p)
                  , I = Math.sin(p)
                  , L = Math.tan(C / 4)
                  , D = 4 / 3 * r * L
                  , F = 4 / 3 * n * L
                  , U = [t, e]
                  , B = [t + D * O, e - F * N]
                  , G = [a + D * I, h - F * k]
                  , V = [a, h];
                if (B[0] = 2 * U[0] - B[0],
                B[1] = 2 * U[1] - B[1],
                u)
                    return [B, G, V].concat(_);
                _ = [B, G, V].concat(_).join().split(",");
                for (var q = [], H = 0, j = _.length; j > H; H++)
                    q[H] = H % 2 ? x(_[H - 1], _[H], v).y : x(_[H], _[H + 1], v).x;
                return q
            }
            function g(t, e) {
                for (var r = [], n = 0, i = t.length; i - 2 * !e > n; n += 2) {
                    var o = [{
                        x: +t[n - 2],
                        y: +t[n - 1]
                    }, {
                        x: +t[n],
                        y: +t[n + 1]
                    }, {
                        x: +t[n + 2],
                        y: +t[n + 3]
                    }, {
                        x: +t[n + 4],
                        y: +t[n + 5]
                    }];
                    e ? n ? i - 4 === n ? o[3] = {
                        x: +t[0],
                        y: +t[1]
                    } : i - 2 === n && (o[2] = {
                        x: +t[0],
                        y: +t[1]
                    },
                    o[3] = {
                        x: +t[2],
                        y: +t[3]
                    }) : o[0] = {
                        x: +t[i - 2],
                        y: +t[i - 1]
                    } : i - 4 === n ? o[3] = o[2] : n || (o[0] = {
                        x: +t[n],
                        y: +t[n + 1]
                    }),
                    r.push(["C", (-o[0].x + 6 * o[1].x + o[2].x) / 6, (-o[0].y + 6 * o[1].y + o[2].y) / 6, (o[1].x + 6 * o[2].x - o[3].x) / 6, (o[1].y + 6 * o[2].y - o[3].y) / 6, o[2].x, o[2].y])
                }
                return r
            }
            function v(t, e, r, n) {
                return [t, e, r, n, r, n]
            }
            function _(t, e, r, n, i, o) {
                var s = 1 / 3
                  , a = 2 / 3;
                return [s * t + a * r, s * e + a * n, s * i + a * r, s * o + a * n, i, o]
            }
            function x(t, e, r, n, i, o, s, a, h) {
                null == h && (h = 1),
                h = h > 1 ? 1 : 0 > h ? 0 : h;
                for (var u = h / 2, l = 12, p = [-.1252, .1252, -.3678, .3678, -.5873, .5873, -.7699, .7699, -.9041, .9041, -.9816, .9816], c = 0, d = [.2491, .2491, .2335, .2335, .2032, .2032, .1601, .1601, .1069, .1069, .0472, .0472], f = 0; l > f; f++) {
                    var m = u * p[f] + u
                      , y = T(m, t, r, i, s)
                      , g = T(m, e, n, o, a)
                      , v = y * y + g * g;
                    c += d[f] * Math.sqrt(v)
                }
                return u * c
            }
            function b(t, e, r, n, i, o, s, a, h) {
                if (!(0 > h || x(t, e, r, n, i, o, s, a) < h)) {
                    var u, l = 1, p = l / 2, c = l - p, d = .01;
                    for (u = x(t, e, r, n, i, o, s, a, c); Math.abs(u - h) > d; )
                        p /= 2,
                        c += (h > u ? 1 : -1) * p,
                        u = x(t, e, r, n, i, o, s, a, c);
                    return c
                }
            }
            function T(t, e, r, n, i) {
                var o = -3 * e + 9 * r - 9 * n + 3 * i
                  , s = t * o + 6 * e - 12 * r + 6 * n;
                return t * s - 3 * e + 3 * r
            }
            function w() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                e = t.length;
                for (var r = ""; e--; )
                    r += t[e] === Object(t[e]) ? JSON.stringify(t[e]) : t[e];
                return r
            }
            var S = t("../core/core")
              , M = t("../core/constants");
            S.Font = function(t) {
                this.parent = t,
                this.cache = {},
                this.font = void 0
            }
            ,
            S.Font.prototype.list = function() {
                throw "not yet implemented"
            }
            ,
            S.Font.prototype.textBounds = function(t, e, r, n, i) {
                e = void 0 !== e ? e : 0,
                r = void 0 !== r ? r : 0,
                n = n || this.parent._renderer._textSize;
                var o = i && i.renderer && i.renderer._pInst || this.parent
                  , s = o._renderer.drawingContext
                  , a = s.textAlign || M.LEFT
                  , h = s.textBaseline || M.BASELINE
                  , u = this.cache[w("textBounds", t, e, r, n, a, h)];
                if (!u) {
                    var l, p, c, d, f = [], m = [], y = this, g = this._scale(n);
                    this.font.forEachGlyph(t, e, r, n, i, function(t, e, r, i) {
                        f.push(e),
                        m.push(r);
                        var o = t.getMetrics();
                        "space" !== t.name ? (f.push(e + o.xMax * g),
                        m.push(r + -o.yMin * g),
                        m.push(r + -o.yMax * g)) : f.push(e + y.font.charToGlyph(" ").advanceWidth * y._scale(n))
                    }),
                    l = Math.min.apply(null, f),
                    p = Math.min.apply(null, m),
                    c = Math.max.apply(null, f),
                    d = Math.max.apply(null, m),
                    u = {
                        x: l,
                        y: p,
                        h: d - p,
                        w: c - l,
                        advance: l - e
                    };
                    var v = u.w + u.advance
                      , _ = this._handleAlignment(o, s, t, u.x, u.y, v);
                    u.x = _.x,
                    u.y = _.y,
                    this.cache[w("textBounds", t, e, r, n, a, h)] = u
                }
                return u
            }
            ,
            S.Font.prototype.textToPoints = function(t, e, r, i, s) {
                var a = 0
                  , h = []
                  , u = this._getGlyphs(t);
                i = i || this.parent._renderer._textSize;
                for (var l = 0; l < u.length; l++) {
                    for (var p = u[l].getPath(e, r, i), c = o(p.commands), d = 0; d < c.length; d++)
                        for (var f = n(c[d], s), m = 0; m < f.length; m++)
                            f[m].x += a,
                            h.push(f[m]);
                    a += u[l].advanceWidth * this._scale(i)
                }
                return h
            }
            ,
            S.Font.prototype._getGlyphs = function(t) {
                return this.font.stringToGlyphs(t)
            }
            ,
            S.Font.prototype._getPath = function(t, e, r, n) {
                var i = n && n.renderer && n.renderer._pInst || this.parent
                  , o = i._renderer.drawingContext
                  , s = this._handleAlignment(i, o, t, e, r);
                return this.font.getPath(t, s.x, s.y, i._renderer._textSize, n)
            }
            ,
            S.Font.prototype._getPathData = function(t, e, r, n) {
                var i = 3;
                return "string" == typeof t && arguments.length > 2 ? t = this._getPath(t, e, r, n) : "object" == typeof e && (n = e),
                n && "number" == typeof n.decimals && (i = n.decimals),
                t.toPathData(i)
            }
            ,
            S.Font.prototype._getSVG = function(t, e, r, n) {
                var i = 3;
                return "string" == typeof t && arguments.length > 2 ? t = this._getPath(t, e, r, n) : "object" == typeof e && (n = e),
                n && ("number" == typeof n.decimals && (i = n.decimals),
                "number" == typeof n.strokeWidth && (t.strokeWidth = n.strokeWidth),
                "undefined" != typeof n.fill && (t.fill = n.fill),
                "undefined" != typeof n.stroke && (t.stroke = n.stroke)),
                t.toSVG(i)
            }
            ,
            S.Font.prototype._renderPath = function(t, e, r, n) {
                var i, o = n && n.renderer || this.parent._renderer, s = o.drawingContext;
                i = "object" == typeof t && t.commands ? t.commands : this._getPath(t, e, r, n).commands,
                s.beginPath();
                for (var a = 0; a < i.length; a += 1) {
                    var h = i[a];
                    "M" === h.type ? s.moveTo(h.x, h.y) : "L" === h.type ? s.lineTo(h.x, h.y) : "C" === h.type ? s.bezierCurveTo(h.x1, h.y1, h.x2, h.y2, h.x, h.y) : "Q" === h.type ? s.quadraticCurveTo(h.x1, h.y1, h.x, h.y) : "Z" === h.type && s.closePath()
                }
                return o._doStroke && o._strokeSet && s.stroke(),
                o._doFill && (s.fillStyle = o._fillSet ? s.fillStyle : M._DEFAULT_TEXT_FILL,
                s.fill()),
                this
            }
            ,
            S.Font.prototype._textWidth = function(t, e) {
                if (" " === t)
                    return this.font.charToGlyph(" ").advanceWidth * this._scale(e);
                var r = this.textBounds(t, 0, 0, e);
                return r.w + r.advance
            }
            ,
            S.Font.prototype._textAscent = function(t) {
                return this.font.ascender * this._scale(t)
            }
            ,
            S.Font.prototype._textDescent = function(t) {
                return -this.font.descender * this._scale(t)
            }
            ,
            S.Font.prototype._scale = function(t) {
                return 1 / this.font.unitsPerEm * (t || this.parent._renderer._textSize)
            }
            ,
            S.Font.prototype._handleAlignment = function(t, e, r, n, i, o) {
                var s = t._renderer._textSize
                  , a = this._textAscent(s)
                  , h = this._textDescent(s);
                return o = void 0 !== o ? o : this._textWidth(r, s),
                e.textAlign === M.CENTER ? n -= o / 2 : e.textAlign === M.RIGHT && (n -= o),
                e.textBaseline === M.TOP ? i += a : e.textBaseline === M._CTX_MIDDLE ? i += a / 2 : e.textBaseline === M.BOTTOM && (i -= h),
                {
                    x: n,
                    y: i
                }
            }
            ,
            e.exports = S.Font
        }
        , {
            "../core/constants": 36,
            "../core/core": 37
        }],
        73: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.prototype.append = function(t, e) {
                return t.push(e),
                t
            }
            ,
            n.prototype.arrayCopy = function(t, e, r, n, i) {
                var o, s;
                "undefined" != typeof i ? (s = Math.min(i, t.length),
                o = n,
                t = t.slice(e, s + e)) : ("undefined" != typeof r ? (s = r,
                s = Math.min(s, t.length)) : s = t.length,
                o = 0,
                r = e,
                t = t.slice(0, s)),
                Array.prototype.splice.apply(r, [o, s].concat(t))
            }
            ,
            n.prototype.concat = function(t, e) {
                return t.concat(e)
            }
            ,
            n.prototype.reverse = function(t) {
                return t.reverse()
            }
            ,
            n.prototype.shorten = function(t) {
                return t.pop(),
                t
            }
            ,
            n.prototype.shuffle = function(t, e) {
                var r = ArrayBuffer && ArrayBuffer.isView && ArrayBuffer.isView(t);
                t = e || r ? t : t.slice();
                for (var n, i, o = t.length; o > 1; )
                    n = Math.random() * o | 0,
                    i = t[--o],
                    t[o] = t[n],
                    t[n] = i;
                return t
            }
            ,
            n.prototype.sort = function(t, e) {
                var r = e ? t.slice(0, Math.min(e, t.length)) : t
                  , n = e ? t.slice(Math.min(e, t.length)) : [];
                return r = "string" == typeof r[0] ? r.sort() : r.sort(function(t, e) {
                    return t - e
                }),
                r.concat(n)
            }
            ,
            n.prototype.splice = function(t, e, r) {
                return Array.prototype.splice.apply(t, [r, 0].concat(e)),
                t
            }
            ,
            n.prototype.subset = function(t, e, r) {
                return "undefined" != typeof r ? t.slice(e, e + r) : t.slice(e, t.length)
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        74: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.prototype["float"] = function(t) {
                return parseFloat(t)
            }
            ,
            n.prototype["int"] = function(t, e) {
                return "string" == typeof t ? (e = e || 10,
                parseInt(t, e)) : "number" == typeof t ? 0 | t : "boolean" == typeof t ? t ? 1 : 0 : t instanceof Array ? t.map(function(t) {
                    return n.prototype["int"](t, e)
                }) : void 0
            }
            ,
            n.prototype.str = function(t) {
                return t instanceof Array ? t.map(n.prototype.str) : String(t)
            }
            ,
            n.prototype["boolean"] = function(t) {
                return "number" == typeof t ? 0 !== t : "string" == typeof t ? "true" === t.toLowerCase() : "boolean" == typeof t ? t : t instanceof Array ? t.map(n.prototype["boolean"]) : void 0
            }
            ,
            n.prototype["byte"] = function(t) {
                var e = n.prototype["int"](t, 10);
                return "number" == typeof e ? (e + 128) % 256 - 128 : e instanceof Array ? e.map(n.prototype["byte"]) : void 0
            }
            ,
            n.prototype["char"] = function(t) {
                return "number" != typeof t || isNaN(t) ? t instanceof Array ? t.map(n.prototype["char"]) : "string" == typeof t ? n.prototype["char"](parseInt(t, 10)) : void 0 : String.fromCharCode(t)
            }
            ,
            n.prototype.unchar = function(t) {
                return "string" == typeof t && 1 === t.length ? t.charCodeAt(0) : t instanceof Array ? t.map(n.prototype.unchar) : void 0
            }
            ,
            n.prototype.hex = function(t, e) {
                if (e = void 0 === e || null === e ? e = 8 : e,
                t instanceof Array)
                    return t.map(function(t) {
                        return n.prototype.hex(t, e)
                    });
                if ("number" == typeof t) {
                    0 > t && (t = 4294967295 + t + 1);
                    for (var r = Number(t).toString(16).toUpperCase(); r.length < e; )
                        r = "0" + r;
                    return r.length >= e && (r = r.substring(r.length - e, r.length)),
                    r
                }
            }
            ,
            n.prototype.unhex = function(t) {
                return t instanceof Array ? t.map(n.prototype.unhex) : parseInt("0x" + t, 16)
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        75: [function(t, e, r) {
            "use strict";
            function n() {
                var t = arguments[0]
                  , e = 0 > t
                  , r = e ? t.toString().substring(1) : t.toString()
                  , n = r.indexOf(".")
                  , i = -1 !== n ? r.substring(0, n) : r
                  , o = -1 !== n ? r.substring(n + 1) : ""
                  , s = e ? "-" : "";
                if (3 === arguments.length) {
                    var a = "";
                    (-1 !== n || arguments[2] - o.length > 0) && (a = "."),
                    o.length > arguments[2] && (o = o.substring(0, arguments[2]));
                    for (var h = 0; h < arguments[1] - i.length; h++)
                        s += "0";
                    s += i,
                    s += a,
                    s += o;
                    for (var u = 0; u < arguments[2] - o.length; u++)
                        s += "0";
                    return s
                }
                for (var l = 0; l < Math.max(arguments[1] - i.length, 0); l++)
                    s += "0";
                return s += r
            }
            function i() {
                var t = arguments[0].toString()
                  , e = t.indexOf(".")
                  , r = -1 !== e ? t.substring(e) : ""
                  , n = -1 !== e ? t.substring(0, e) : t;
                if (n = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                0 === arguments[1])
                    r = "";
                else if (void 0 !== arguments[1])
                    if (arguments[1] > r.length) {
                        r += -1 === e ? "." : "";
                        for (var i = arguments[1] - r.length + 1, o = 0; i > o; o++)
                            r += "0"
                    } else
                        r = r.substring(0, arguments[1] + 1);
                return n + r
            }
            function o() {
                return parseFloat(arguments[0]) > 0 ? "+" + arguments[0].toString() : arguments[0].toString()
            }
            function s() {
                return parseFloat(arguments[0]) > 0 ? " " + arguments[0].toString() : arguments[0].toString()
            }
            var a = t("../core/core");
            a.prototype.join = function(t, e) {
                return t.join(e)
            }
            ,
            a.prototype.match = function(t, e) {
                return t.match(e)
            }
            ,
            a.prototype.matchAll = function(t, e) {
                for (var r = new RegExp(e,"g"), n = r.exec(t), i = []; null !== n; )
                    i.push(n),
                    n = r.exec(t);
                return i
            }
            ,
            a.prototype.nf = function() {
                if (arguments[0]instanceof Array) {
                    var t = arguments[1]
                      , e = arguments[2];
                    return arguments[0].map(function(r) {
                        return n(r, t, e)
                    })
                }
                var r = Object.prototype.toString.call(arguments[0]);
                return "[object Arguments]" === r ? 3 === arguments[0].length ? this.nf(arguments[0][0], arguments[0][1], arguments[0][2]) : 2 === arguments[0].length ? this.nf(arguments[0][0], arguments[0][1]) : this.nf(arguments[0][0]) : n.apply(this, arguments)
            }
            ,
            a.prototype.nfc = function() {
                if (arguments[0]instanceof Array) {
                    var t = arguments[1];
                    return arguments[0].map(function(e) {
                        return i(e, t)
                    })
                }
                return i.apply(this, arguments)
            }
            ,
            a.prototype.nfp = function() {
                var t = this.nf.apply(this, arguments);
                return t instanceof Array ? t.map(o) : o(t)
            }
            ,
            a.prototype.nfs = function() {
                var t = this.nf.apply(this, arguments);
                return t instanceof Array ? t.map(s) : s(t)
            }
            ,
            a.prototype.split = function(t, e) {
                return t.split(e)
            }
            ,
            a.prototype.splitTokens = function() {
                var t, e, r, n;
                return n = arguments[1],
                arguments.length > 1 ? (r = /\]/g.exec(n),
                e = /\[/g.exec(n),
                e && r ? (n = n.slice(0, r.index) + n.slice(r.index + 1),
                e = /\[/g.exec(n),
                n = n.slice(0, e.index) + n.slice(e.index + 1),
                t = new RegExp("[\\[" + n + "\\]]","g")) : r ? (n = n.slice(0, r.index) + n.slice(r.index + 1),
                t = new RegExp("[" + n + "\\]]","g")) : e ? (n = n.slice(0, e.index) + n.slice(e.index + 1),
                t = new RegExp("[" + n + "\\[]","g")) : t = new RegExp("[" + n + "]","g")) : t = /\s/g,
                arguments[0].split(t).filter(function(t) {
                    return t
                })
            }
            ,
            a.prototype.trim = function(t) {
                return t instanceof Array ? t.map(this.trim) : t.trim()
            }
            ,
            e.exports = a
        }
        , {
            "../core/core": 37
        }],
        76: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.prototype.day = function() {
                return (new Date).getDate()
            }
            ,
            n.prototype.hour = function() {
                return (new Date).getHours()
            }
            ,
            n.prototype.minute = function() {
                return (new Date).getMinutes()
            }
            ,
            n.prototype.millis = function() {
                return window.performance.now()
            }
            ,
            n.prototype.month = function() {
                return (new Date).getMonth() + 1
            }
            ,
            n.prototype.second = function() {
                return (new Date).getSeconds()
            }
            ,
            n.prototype.year = function() {
                return (new Date).getFullYear()
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        77: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.prototype.camera = function(t, e, r) {
                for (var n = new Array(arguments.length), i = 0; i < n.length; ++i)
                    n[i] = arguments[i];
                this._validateParameters("camera", n, ["Number", "Number", "Number"]),
                this._renderer.translate(-t, -e, -r)
            }
            ,
            n.prototype.perspective = function(t, e, r, i) {
                for (var o = new Array(arguments.length), s = 0; s < o.length; ++s)
                    o[s] = arguments[s];
                this._renderer.uPMatrix = n.Matrix.identity(),
                this._renderer.uPMatrix.perspective(t, e, r, i),
                this._renderer._isSetCamera = !0
            }
            ,
            n.prototype.ortho = function(t, e, r, i, o, s) {
                for (var a = new Array(arguments.length), h = 0; h < a.length; ++h)
                    a[h] = arguments[h];
                this._validateParameters("ortho", a, ["Number", "Number", "Number", "Number", "Number", "Number"]),
                t /= this.width,
                e /= this.width,
                i /= this.height,
                r /= this.height,
                this._renderer.uPMatrix = n.Matrix.identity(),
                this._renderer.uPMatrix.ortho(t, e, r, i, o, s),
                this._renderer._setCamera = !0
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        78: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.prototype.orbitControl = function() {
                return this.mouseIsPressed && (this.rotateY((this.mouseX - this.width / 2) / (this.width / 2)),
                this.rotateX((this.mouseY - this.height / 2) / (this.width / 2))),
                this
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        79: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.prototype.ambientLight = function(t, e, r, n) {
                var i = this._renderer.GL
                  , o = this._renderer._getShader("lightVert", "lightTextureFrag");
                i.useProgram(o),
                o.uAmbientColor = i.getUniformLocation(o, "uAmbientColor[" + this._renderer.ambientLightCount + "]");
                var s = this._renderer._pInst.color.apply(this._renderer._pInst, arguments)
                  , a = s._array;
                return i.uniform3f(o.uAmbientColor, a[0], a[1], a[2]),
                o.uMaterialColor = i.getUniformLocation(o, "uMaterialColor"),
                i.uniform4f(o.uMaterialColor, 1, 1, 1, 1),
                this._renderer.ambientLightCount++,
                o.uAmbientLightCount = i.getUniformLocation(o, "uAmbientLightCount"),
                i.uniform1i(o.uAmbientLightCount, this._renderer.ambientLightCount),
                this
            }
            ,
            n.prototype.directionalLight = function(t, e, r, n, i, o, s) {
                var a = this._renderer.GL
                  , h = this._renderer._getShader("lightVert", "lightTextureFrag");
                a.useProgram(h),
                h.uDirectionalColor = a.getUniformLocation(h, "uDirectionalColor[" + this._renderer.directionalLightCount + "]");
                var u = this._renderer._pInst.color.apply(this._renderer._pInst, [t, e, r])
                  , l = u._array;
                a.uniform3f(h.uDirectionalColor, l[0], l[1], l[2]);
                var p, c, d;
                if ("number" == typeof arguments[arguments.length - 1])
                    p = arguments[arguments.length - 3],
                    c = arguments[arguments.length - 2],
                    d = arguments[arguments.length - 1];
                else
                    try {
                        p = arguments[arguments.length - 1].x,
                        c = arguments[arguments.length - 1].y,
                        d = arguments[arguments.length - 1].z
                    } catch (f) {
                        throw f
                    }
                return h.uLightingDirection = a.getUniformLocation(h, "uLightingDirection[" + this._renderer.directionalLightCount + "]"),
                a.uniform3f(h.uLightingDirection, p, c, d),
                h.uMaterialColor = a.getUniformLocation(h, "uMaterialColor"),
                a.uniform4f(h.uMaterialColor, 1, 1, 1, 1),
                this._renderer.directionalLightCount++,
                h.uDirectionalLightCount = a.getUniformLocation(h, "uDirectionalLightCount"),
                a.uniform1i(h.uDirectionalLightCount, this._renderer.directionalLightCount),
                this
            }
            ,
            n.prototype.pointLight = function(t, e, r, n, i, o, s) {
                var a = this._renderer.GL
                  , h = this._renderer._getShader("lightVert", "lightTextureFrag");
                a.useProgram(h),
                h.uPointLightColor = a.getUniformLocation(h, "uPointLightColor[" + this._renderer.pointLightCount + "]");
                var u = this._renderer._pInst.color.apply(this._renderer._pInst, [t, e, r])
                  , l = u._array;
                a.uniform3f(h.uPointLightColor, l[0], l[1], l[2]);
                var p, c, d;
                if ("number" == typeof arguments[arguments.length - 1])
                    p = arguments[arguments.length - 3],
                    c = arguments[arguments.length - 2],
                    d = arguments[arguments.length - 1];
                else
                    try {
                        p = arguments[arguments.length - 1].x,
                        c = arguments[arguments.length - 1].y,
                        d = arguments[arguments.length - 1].z
                    } catch (f) {
                        throw f
                    }
                return h.uPointLightLocation = a.getUniformLocation(h, "uPointLightLocation[" + this._renderer.pointLightCount + "]"),
                a.uniform3f(h.uPointLightLocation, p, c, d),
                h.uMaterialColor = a.getUniformLocation(h, "uMaterialColor"),
                a.uniform4f(h.uMaterialColor, 1, 1, 1, 1),
                this._renderer.pointLightCount++,
                h.uPointLightCount = a.getUniformLocation(h, "uPointLightCount"),
                a.uniform1i(h.uPointLightCount, this._renderer.pointLightCount),
                this
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        80: [function(t, e, r) {
            "use strict";
            function n(t, e) {
                for (var r = {
                    v: [],
                    vt: [],
                    vn: []
                }, n = {}, o = 0; o < e.length; ++o) {
                    var s = e[o].trim().split(/\b\s+/);
                    if (s.length > 0)
                        if ("v" === s[0] || "vn" === s[0]) {
                            var a = new i.Vector(parseFloat(s[1]),parseFloat(s[2]),parseFloat(s[3]));
                            r[s[0]].push(a)
                        } else if ("vt" === s[0]) {
                            var h = [parseFloat(s[1]), parseFloat(s[2])];
                            r[s[0]].push(h)
                        } else if ("f" === s[0])
                            for (var u = 3; u < s.length; ++u) {
                                for (var l = [], p = [1, u - 1, u], c = 0; c < p.length; ++c) {
                                    var d = s[p[c]]
                                      , f = 0;
                                    if (void 0 !== n[d])
                                        f = n[d];
                                    else {
                                        for (var m = d.split("/"), y = 0; y < m.length; y++)
                                            m[y] = parseInt(m[y]) - 1;
                                        f = n[d] = t.vertices.length,
                                        t.vertices.push(r.v[m[0]].copy()),
                                        r.vt[m[1]] ? t.uvs.push(r.vt[m[1]].slice()) : t.uvs.push([0, 0]),
                                        r.vn[m[2]] && t.vertexNormals.push(r.vn[m[2]].copy())
                                    }
                                    l.push(f)
                                }
                                t.faces.push(l)
                            }
                }
                return 0 === t.vertexNormals.length && t.computeNormals(),
                t
            }
            var i = t("../core/core");
            t("./p5.Geometry"),
            i.prototype.loadModel = function() {
                var t, e, r, o = arguments[0];
                "boolean" == typeof arguments[1] ? (t = arguments[1],
                e = arguments[2],
                r = arguments[3]) : (t = !1,
                e = arguments[1],
                r = arguments[2]);
                var s = new i.Geometry;
                return s.gid = o + "|" + t,
                this.loadStrings(o, function(r) {
                    n(s, r),
                    t && s.normalize(),
                    "function" == typeof e && e(s)
                }
                .bind(this), r),
                s
            }
            ,
            i.prototype.model = function(t) {
                t.vertices.length > 0 && (this._renderer.geometryInHash(t.gid) || this._renderer.createBuffers(t.gid, t),
                this._renderer.drawBuffers(t.gid))
            }
            ,
            e.exports = i
        }
        , {
            "../core/core": 37,
            "./p5.Geometry": 82
        }],
        81: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.prototype.normalMaterial = function() {
                return this._renderer._getShader("normalVert", "normalFrag"),
                this
            }
            ,
            n.prototype.texture = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                var r = this._renderer.GL
                  , i = this._renderer._getShader("lightVert", "lightTextureFrag");
                r.useProgram(i);
                var o;
                if (t[0].isTexture)
                    t[0]instanceof n.Graphics || t[0]instanceof n.MediaElement ? o = t[0].elt : t[0]instanceof n.Image && (o = t[0].canvas),
                    this._renderer._bind.call(this, t[0].tex, o);
                else {
                    if (t[0]instanceof n.Image)
                        o = t[0].canvas;
                    else if (t[0]instanceof n.MediaElement) {
                        if (!t[0].loadedmetadata)
                            return;
                        o = t[0].elt
                    } else
                        t[0]instanceof n.Graphics && (o = t[0].elt);
                    var s = r.createTexture();
                    t[0]._setProperty("tex", s),
                    t[0]._setProperty("isTexture", !0),
                    this._renderer._bind.call(this, s, o)
                }
                return r.activeTexture(r.TEXTURE0),
                r.bindTexture(r.TEXTURE_2D, t[0].tex),
                r.uniform1i(r.getUniformLocation(i, "isTexture"), !0),
                r.uniform1i(r.getUniformLocation(i, "uSampler"), 0),
                this
            }
            ,
            n.RendererGL.prototype._bind = function(t, e) {
                var r = this._renderer.GL;
                r.bindTexture(r.TEXTURE_2D, t),
                r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !0),
                r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, e),
                r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !0),
                r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR),
                r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR),
                r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE),
                r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE),
                r.bindTexture(r.TEXTURE_2D, null)
            }
            ,
            n.prototype.ambientMaterial = function(t, e, r, n) {
                var i = this._renderer.GL
                  , o = this._renderer._getShader("lightVert", "lightTextureFrag");
                i.useProgram(o),
                o.uMaterialColor = i.getUniformLocation(o, "uMaterialColor");
                var s = this._renderer._applyColorBlend(t, e, r, n);
                return i.uniform4f(o.uMaterialColor, s[0], s[1], s[2], s[3]),
                o.uSpecular = i.getUniformLocation(o, "uSpecular"),
                i.uniform1i(o.uSpecular, !1),
                i.uniform1i(i.getUniformLocation(o, "isTexture"), !1),
                this
            }
            ,
            n.prototype.specularMaterial = function(t, e, r, n) {
                var i = this._renderer.GL
                  , o = this._renderer._getShader("lightVert", "lightTextureFrag");
                i.useProgram(o),
                i.uniform1i(i.getUniformLocation(o, "isTexture"), !1),
                o.uMaterialColor = i.getUniformLocation(o, "uMaterialColor");
                var s = this._renderer._applyColorBlend(t, e, r, n);
                return i.uniform4f(o.uMaterialColor, s[0], s[1], s[2], s[3]),
                o.uSpecular = i.getUniformLocation(o, "uSpecular"),
                i.uniform1i(o.uSpecular, !0),
                this
            }
            ,
            n.RendererGL.prototype._applyColorBlend = function(t, e, r, n) {
                var i = this.GL
                  , o = this._pInst.color.apply(this._pInst, arguments)
                  , s = o._array;
                return s[s.length - 1] < 1 ? (i.depthMask(!1),
                i.enable(i.BLEND),
                i.blendEquation(i.FUNC_ADD),
                i.blendFunc(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA)) : (i.depthMask(!0),
                i.disable(i.BLEND)),
                s
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37
        }],
        82: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            n.Geometry = function(t, e, r) {
                return this.vertices = [],
                this.vertexNormals = [],
                this.faces = [],
                this.uvs = [],
                this.detailX = void 0 !== t ? t : 1,
                this.detailY = void 0 !== e ? e : 1,
                r instanceof Function && r.call(this),
                this
            }
            ,
            n.Geometry.prototype.computeFaces = function() {
                for (var t, e, r, n, i = this.detailX + 1, o = 0; o < this.detailY; o++)
                    for (var s = 0; s < this.detailX; s++)
                        t = o * i + s,
                        e = o * i + s + 1,
                        r = (o + 1) * i + s + 1,
                        n = (o + 1) * i + s,
                        this.faces.push([t, e, n]),
                        this.faces.push([n, e, r]);
                return this
            }
            ,
            n.Geometry.prototype._getFaceNormal = function(t, e) {
                var r = this.faces[t]
                  , i = this.vertices[r[e % 3]]
                  , o = this.vertices[r[(e + 1) % 3]]
                  , s = this.vertices[r[(e + 2) % 3]]
                  , a = n.Vector.cross(n.Vector.sub(o, i), n.Vector.sub(s, i))
                  , h = n.Vector.mag(a) / (n.Vector.mag(n.Vector.sub(o, i)) * n.Vector.mag(n.Vector.sub(s, i)));
                return a = a.normalize(),
                a.mult(Math.asin(h))
            }
            ,
            n.Geometry.prototype.computeNormals = function() {
                for (var t = 0; t < this.vertices.length; t++) {
                    for (var e = new n.Vector, r = 0; r < this.faces.length; r++)
                        (this.faces[r][0] === t || this.faces[r][1] === t || this.faces[r][2] === t) && (e = e.add(this._getFaceNormal(r, t)));
                    e = e.normalize(),
                    this.vertexNormals.push(e)
                }
            }
            ,
            n.Geometry.prototype.averageNormals = function() {
                for (var t = 0; t <= this.detailY; t++) {
                    var e = this.detailX + 1
                      , r = n.Vector.add(this.vertexNormals[t * e], this.vertexNormals[t * e + this.detailX]);
                    r = n.Vector.div(r, 2),
                    this.vertexNormals[t * e] = r,
                    this.vertexNormals[t * e + this.detailX] = r
                }
                return this
            }
            ,
            n.Geometry.prototype.averagePoleNormals = function() {
                for (var t = new n.Vector(0,0,0), e = 0; e < this.detailX; e++)
                    t.add(this.vertexNormals[e]);
                for (t = n.Vector.div(t, this.detailX),
                e = 0; e < this.detailX; e++)
                    this.vertexNormals[e] = t;
                for (t = new n.Vector(0,0,0),
                e = this.vertices.length - 1; e > this.vertices.length - 1 - this.detailX; e--)
                    t.add(this.vertexNormals[e]);
                for (t = n.Vector.div(t, this.detailX),
                e = this.vertices.length - 1; e > this.vertices.length - 1 - this.detailX; e--)
                    this.vertexNormals[e] = t;
                return this
            }
            ,
            n.Geometry.prototype.normalize = function() {
                if (this.vertices.length > 0) {
                    for (var t = this.vertices[0].copy(), e = this.vertices[0].copy(), r = 0; r < this.vertices.length; r++)
                        t.x = Math.max(t.x, this.vertices[r].x),
                        e.x = Math.min(e.x, this.vertices[r].x),
                        t.y = Math.max(t.y, this.vertices[r].y),
                        e.y = Math.min(e.y, this.vertices[r].y),
                        t.z = Math.max(t.z, this.vertices[r].z),
                        e.z = Math.min(e.z, this.vertices[r].z);
                    var i = n.Vector.lerp(t, e, .5)
                      , o = n.Vector.sub(t, e)
                      , s = Math.max(Math.max(o.x, o.y), o.z)
                      , a = 200 / s;
                    for (r = 0; r < this.vertices.length; r++)
                        this.vertices[r].sub(i),
                        this.vertices[r].mult(a)
                }
                return this
            }
            ,
            e.exports = n.Geometry
        }
        , {
            "../core/core": 37
        }],
        83: [function(t, e, r) {
            "use strict";
            var n = t("../core/core")
              , i = t("../math/polargeometry")
              , o = t("../core/constants")
              , s = "undefined" != typeof Float32Array ? Float32Array : Array;
            n.Matrix = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                return t[0]instanceof n ? (this.p5 = t[0],
                "mat3" === t[1] ? this.mat3 = t[2] || new s([1, 0, 0, 0, 1, 0, 0, 0, 1]) : this.mat4 = t[1] || new s([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])) : "mat3" === t[0] ? this.mat3 = t[1] || new s([1, 0, 0, 0, 1, 0, 0, 0, 1]) : this.mat4 = t[0] || new s([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
                this
            }
            ,
            n.Matrix.prototype.set = function(t) {
                return t instanceof n.Matrix ? (this.mat4 = t.mat4,
                this) : t instanceof s ? (this.mat4 = t,
                this) : this
            }
            ,
            n.Matrix.prototype.get = function() {
                return new n.Matrix(this.mat4)
            }
            ,
            n.Matrix.prototype.copy = function() {
                var t = new n.Matrix;
                return t.mat4[0] = this.mat4[0],
                t.mat4[1] = this.mat4[1],
                t.mat4[2] = this.mat4[2],
                t.mat4[3] = this.mat4[3],
                t.mat4[4] = this.mat4[4],
                t.mat4[5] = this.mat4[5],
                t.mat4[6] = this.mat4[6],
                t.mat4[7] = this.mat4[7],
                t.mat4[8] = this.mat4[8],
                t.mat4[9] = this.mat4[9],
                t.mat4[10] = this.mat4[10],
                t.mat4[11] = this.mat4[11],
                t.mat4[12] = this.mat4[12],
                t.mat4[13] = this.mat4[13],
                t.mat4[14] = this.mat4[14],
                t.mat4[15] = this.mat4[15],
                t
            }
            ,
            n.Matrix.identity = function() {
                return new n.Matrix
            }
            ,
            n.Matrix.prototype.transpose = function(t) {
                var e, r, i, o, a, h;
                return t instanceof n.Matrix ? (e = t.mat4[1],
                r = t.mat4[2],
                i = t.mat4[3],
                o = t.mat4[6],
                a = t.mat4[7],
                h = t.mat4[11],
                this.mat4[0] = t.mat4[0],
                this.mat4[1] = t.mat4[4],
                this.mat4[2] = t.mat4[8],
                this.mat4[3] = t.mat4[12],
                this.mat4[4] = e,
                this.mat4[5] = t.mat4[5],
                this.mat4[6] = t.mat4[9],
                this.mat4[7] = t.mat4[13],
                this.mat4[8] = r,
                this.mat4[9] = o,
                this.mat4[10] = t.mat4[10],
                this.mat4[11] = t.mat4[14],
                this.mat4[12] = i,
                this.mat4[13] = a,
                this.mat4[14] = h,
                this.mat4[15] = t.mat4[15]) : t instanceof s && (e = t[1],
                r = t[2],
                i = t[3],
                o = t[6],
                a = t[7],
                h = t[11],
                this.mat4[0] = t[0],
                this.mat4[1] = t[4],
                this.mat4[2] = t[8],
                this.mat4[3] = t[12],
                this.mat4[4] = e,
                this.mat4[5] = t[5],
                this.mat4[6] = t[9],
                this.mat4[7] = t[13],
                this.mat4[8] = r,
                this.mat4[9] = o,
                this.mat4[10] = t[10],
                this.mat4[11] = t[14],
                this.mat4[12] = i,
                this.mat4[13] = a,
                this.mat4[14] = h,
                this.mat4[15] = t[15]),
                this
            }
            ,
            n.Matrix.prototype.invert = function(t) {
                var e, r, i, o, a, h, u, l, p, c, d, f, m, y, g, v;
                t instanceof n.Matrix ? (e = t.mat4[0],
                r = t.mat4[1],
                i = t.mat4[2],
                o = t.mat4[3],
                a = t.mat4[4],
                h = t.mat4[5],
                u = t.mat4[6],
                l = t.mat4[7],
                p = t.mat4[8],
                c = t.mat4[9],
                d = t.mat4[10],
                f = t.mat4[11],
                m = t.mat4[12],
                y = t.mat4[13],
                g = t.mat4[14],
                v = t.mat4[15]) : t instanceof s && (e = t[0],
                r = t[1],
                i = t[2],
                o = t[3],
                a = t[4],
                h = t[5],
                u = t[6],
                l = t[7],
                p = t[8],
                c = t[9],
                d = t[10],
                f = t[11],
                m = t[12],
                y = t[13],
                g = t[14],
                v = t[15]);
                var _ = e * h - r * a
                  , x = e * u - i * a
                  , b = e * l - o * a
                  , T = r * u - i * h
                  , w = r * l - o * h
                  , S = i * l - o * u
                  , M = p * y - c * m
                  , A = p * g - d * m
                  , C = p * v - f * m
                  , R = c * g - d * y
                  , E = c * v - f * y
                  , P = d * v - f * g
                  , N = _ * P - x * E + b * R + T * C - w * A + S * M;
                return N ? (N = 1 / N,
                this.mat4[0] = (h * P - u * E + l * R) * N,
                this.mat4[1] = (i * E - r * P - o * R) * N,
                this.mat4[2] = (y * S - g * w + v * T) * N,
                this.mat4[3] = (d * w - c * S - f * T) * N,
                this.mat4[4] = (u * C - a * P - l * A) * N,
                this.mat4[5] = (e * P - i * C + o * A) * N,
                this.mat4[6] = (g * b - m * S - v * x) * N,
                this.mat4[7] = (p * S - d * b + f * x) * N,
                this.mat4[8] = (a * E - h * C + l * M) * N,
                this.mat4[9] = (r * C - e * E - o * M) * N,
                this.mat4[10] = (m * w - y * b + v * _) * N,
                this.mat4[11] = (c * b - p * w - f * _) * N,
                this.mat4[12] = (h * A - a * R - u * M) * N,
                this.mat4[13] = (e * R - r * A + i * M) * N,
                this.mat4[14] = (y * x - m * T - g * _) * N,
                this.mat4[15] = (p * T - c * x + d * _) * N,
                this) : null
            }
            ,
            n.Matrix.prototype.invert3x3 = function() {
                var t = this.mat3[0]
                  , e = this.mat3[1]
                  , r = this.mat3[2]
                  , n = this.mat3[3]
                  , i = this.mat3[4]
                  , o = this.mat3[5]
                  , s = this.mat3[6]
                  , a = this.mat3[7]
                  , h = this.mat3[8]
                  , u = h * i - o * a
                  , l = -h * n + o * s
                  , p = a * n - i * s
                  , c = t * u + e * l + r * p;
                return c ? (c = 1 / c,
                this.mat3[0] = u * c,
                this.mat3[1] = (-h * e + r * a) * c,
                this.mat3[2] = (o * e - r * i) * c,
                this.mat3[3] = l * c,
                this.mat3[4] = (h * t - r * s) * c,
                this.mat3[5] = (-o * t + r * n) * c,
                this.mat3[6] = p * c,
                this.mat3[7] = (-a * t + e * s) * c,
                this.mat3[8] = (i * t - e * n) * c,
                this) : null
            }
            ,
            n.Matrix.prototype.transpose3x3 = function(t) {
                var e = t[1]
                  , r = t[2]
                  , n = t[5];
                return this.mat3[1] = t[3],
                this.mat3[2] = t[6],
                this.mat3[3] = e,
                this.mat3[5] = t[7],
                this.mat3[6] = r,
                this.mat3[7] = n,
                this
            }
            ,
            n.Matrix.prototype.inverseTranspose = function(t) {
                return void 0 === this.mat3 ? console.error("sorry, this function only works with mat3") : (this.mat3[0] = t.mat4[0],
                this.mat3[1] = t.mat4[1],
                this.mat3[2] = t.mat4[2],
                this.mat3[3] = t.mat4[4],
                this.mat3[4] = t.mat4[5],
                this.mat3[5] = t.mat4[6],
                this.mat3[6] = t.mat4[8],
                this.mat3[7] = t.mat4[9],
                this.mat3[8] = t.mat4[10]),
                this.invert3x3().transpose3x3(this.mat3),
                this
            }
            ,
            n.Matrix.prototype.determinant = function() {
                var t = this.mat4[0] * this.mat4[5] - this.mat4[1] * this.mat4[4]
                  , e = this.mat4[0] * this.mat4[6] - this.mat4[2] * this.mat4[4]
                  , r = this.mat4[0] * this.mat4[7] - this.mat4[3] * this.mat4[4]
                  , n = this.mat4[1] * this.mat4[6] - this.mat4[2] * this.mat4[5]
                  , i = this.mat4[1] * this.mat4[7] - this.mat4[3] * this.mat4[5]
                  , o = this.mat4[2] * this.mat4[7] - this.mat4[3] * this.mat4[6]
                  , s = this.mat4[8] * this.mat4[13] - this.mat4[9] * this.mat4[12]
                  , a = this.mat4[8] * this.mat4[14] - this.mat4[10] * this.mat4[12]
                  , h = this.mat4[8] * this.mat4[15] - this.mat4[11] * this.mat4[12]
                  , u = this.mat4[9] * this.mat4[14] - this.mat4[10] * this.mat4[13]
                  , l = this.mat4[9] * this.mat4[15] - this.mat4[11] * this.mat4[13]
                  , p = this.mat4[10] * this.mat4[15] - this.mat4[11] * this.mat4[14];
                return t * p - e * l + r * u + n * h - i * a + o * s
            }
            ,
            n.Matrix.prototype.mult = function(t) {
                var e = new s(16)
                  , r = new s(16);
                t instanceof n.Matrix ? r = t.mat4 : t instanceof s && (r = t);
                var i = this.mat4[0]
                  , o = this.mat4[1]
                  , a = this.mat4[2]
                  , h = this.mat4[3];
                return e[0] = i * r[0] + o * r[4] + a * r[8] + h * r[12],
                e[1] = i * r[1] + o * r[5] + a * r[9] + h * r[13],
                e[2] = i * r[2] + o * r[6] + a * r[10] + h * r[14],
                e[3] = i * r[3] + o * r[7] + a * r[11] + h * r[15],
                i = this.mat4[4],
                o = this.mat4[5],
                a = this.mat4[6],
                h = this.mat4[7],
                e[4] = i * r[0] + o * r[4] + a * r[8] + h * r[12],
                e[5] = i * r[1] + o * r[5] + a * r[9] + h * r[13],
                e[6] = i * r[2] + o * r[6] + a * r[10] + h * r[14],
                e[7] = i * r[3] + o * r[7] + a * r[11] + h * r[15],
                i = this.mat4[8],
                o = this.mat4[9],
                a = this.mat4[10],
                h = this.mat4[11],
                e[8] = i * r[0] + o * r[4] + a * r[8] + h * r[12],
                e[9] = i * r[1] + o * r[5] + a * r[9] + h * r[13],
                e[10] = i * r[2] + o * r[6] + a * r[10] + h * r[14],
                e[11] = i * r[3] + o * r[7] + a * r[11] + h * r[15],
                i = this.mat4[12],
                o = this.mat4[13],
                a = this.mat4[14],
                h = this.mat4[15],
                e[12] = i * r[0] + o * r[4] + a * r[8] + h * r[12],
                e[13] = i * r[1] + o * r[5] + a * r[9] + h * r[13],
                e[14] = i * r[2] + o * r[6] + a * r[10] + h * r[14],
                e[15] = i * r[3] + o * r[7] + a * r[11] + h * r[15],
                this.mat4 = e,
                this
            }
            ,
            n.Matrix.prototype.scale = function() {
                for (var t, e, r, i = new Array(arguments.length), o = 0; o < i.length; o++)
                    i[o] = arguments[o];
                i[0]instanceof n.Vector ? (t = i[0].x,
                e = i[0].y,
                r = i[0].z) : i[0]instanceof Array && (t = i[0][0],
                e = i[0][1],
                r = i[0][2]);
                var a = new s(16);
                return a[0] = this.mat4[0] * t,
                a[1] = this.mat4[1] * t,
                a[2] = this.mat4[2] * t,
                a[3] = this.mat4[3] * t,
                a[4] = this.mat4[4] * e,
                a[5] = this.mat4[5] * e,
                a[6] = this.mat4[6] * e,
                a[7] = this.mat4[7] * e,
                a[8] = this.mat4[8] * r,
                a[9] = this.mat4[9] * r,
                a[10] = this.mat4[10] * r,
                a[11] = this.mat4[11] * r,
                a[12] = this.mat4[12],
                a[13] = this.mat4[13],
                a[14] = this.mat4[14],
                a[15] = this.mat4[15],
                this.mat4 = a,
                this
            }
            ,
            n.Matrix.prototype.rotate = function(t, e) {
                var r, s, a, h, u;
                this.p5 ? this.p5._angleMode === o.DEGREES && (h = i.degreesToRadians(t)) : h = t,
                e instanceof n.Vector ? (r = e.x,
                s = e.y,
                a = e.z) : e instanceof Array && (r = e[0],
                s = e[1],
                a = e[2]),
                u = Math.sqrt(r * r + s * s + a * a),
                r *= 1 / u,
                s *= 1 / u,
                a *= 1 / u;
                var l = this.mat4[0]
                  , p = this.mat4[1]
                  , c = this.mat4[2]
                  , d = this.mat4[3]
                  , f = this.mat4[4]
                  , m = this.mat4[5]
                  , y = this.mat4[6]
                  , g = this.mat4[7]
                  , v = this.mat4[8]
                  , _ = this.mat4[9]
                  , x = this.mat4[10]
                  , b = this.mat4[11]
                  , T = Math.sin(h)
                  , w = Math.cos(h)
                  , S = 1 - w
                  , M = r * r * S + w
                  , A = s * r * S + a * T
                  , C = a * r * S - s * T
                  , R = r * s * S - a * T
                  , E = s * s * S + w
                  , P = a * s * S + r * T
                  , N = r * a * S + s * T
                  , O = s * a * S - r * T
                  , k = a * a * S + w;
                return this.mat4[0] = l * M + f * A + v * C,
                this.mat4[1] = p * M + m * A + _ * C,
                this.mat4[2] = c * M + y * A + x * C,
                this.mat4[3] = d * M + g * A + b * C,
                this.mat4[4] = l * R + f * E + v * P,
                this.mat4[5] = p * R + m * E + _ * P,
                this.mat4[6] = c * R + y * E + x * P,
                this.mat4[7] = d * R + g * E + b * P,
                this.mat4[8] = l * N + f * O + v * k,
                this.mat4[9] = p * N + m * O + _ * k,
                this.mat4[10] = c * N + y * O + x * k,
                this.mat4[11] = d * N + g * O + b * k,
                this
            }
            ,
            n.Matrix.prototype.translate = function(t) {
                var e = t[0]
                  , r = t[1]
                  , n = t[2] || 0;
                this.mat4[12] = this.mat4[0] * e + this.mat4[4] * r + this.mat4[8] * n + this.mat4[12],
                this.mat4[13] = this.mat4[1] * e + this.mat4[5] * r + this.mat4[9] * n + this.mat4[13],
                this.mat4[14] = this.mat4[2] * e + this.mat4[6] * r + this.mat4[10] * n + this.mat4[14],
                this.mat4[15] = this.mat4[3] * e + this.mat4[7] * r + this.mat4[11] * n + this.mat4[15]
            }
            ,
            n.Matrix.prototype.rotateX = function(t) {
                this.rotate(t, [1, 0, 0])
            }
            ,
            n.Matrix.prototype.rotateY = function(t) {
                this.rotate(t, [0, 1, 0])
            }
            ,
            n.Matrix.prototype.rotateZ = function(t) {
                this.rotate(t, [0, 0, 1])
            }
            ,
            n.Matrix.prototype.perspective = function(t, e, r, n) {
                var i = 1 / Math.tan(t / 2)
                  , o = 1 / (r - n);
                return this.mat4[0] = i / e,
                this.mat4[1] = 0,
                this.mat4[2] = 0,
                this.mat4[3] = 0,
                this.mat4[4] = 0,
                this.mat4[5] = i,
                this.mat4[6] = 0,
                this.mat4[7] = 0,
                this.mat4[8] = 0,
                this.mat4[9] = 0,
                this.mat4[10] = (n + r) * o,
                this.mat4[11] = -1,
                this.mat4[12] = 0,
                this.mat4[13] = 0,
                this.mat4[14] = 2 * n * r * o,
                this.mat4[15] = 0,
                this
            }
            ,
            n.Matrix.prototype.ortho = function(t, e, r, n, i, o) {
                var s = 1 / (t - e)
                  , a = 1 / (r - n)
                  , h = 1 / (i - o);
                return this.mat4[0] = -2 * s,
                this.mat4[1] = 0,
                this.mat4[2] = 0,
                this.mat4[3] = 0,
                this.mat4[4] = 0,
                this.mat4[5] = -2 * a,
                this.mat4[6] = 0,
                this.mat4[7] = 0,
                this.mat4[8] = 0,
                this.mat4[9] = 0,
                this.mat4[10] = 2 * h,
                this.mat4[11] = 0,
                this.mat4[12] = (t + e) * s,
                this.mat4[13] = (n + r) * a,
                this.mat4[14] = (o + i) * h,
                this.mat4[15] = 1,
                this
            }
            ,
            e.exports = n.Matrix
        }
        , {
            "../core/constants": 36,
            "../core/core": 37,
            "../math/polargeometry": 67
        }],
        84: [function(t, e, r) {
            "use strict";
            var n = t("../core/core")
              , i = t("../core/constants");
            n.RendererGL.prototype.beginShape = function(t) {
                return this.immediateMode.shapeMode = void 0 !== t ? t : i.LINE_STRIP,
                void 0 === this.immediateMode.vertexPositions ? (this.immediateMode.vertexPositions = [],
                this.immediateMode.vertexColors = [],
                this.immediateMode.vertexBuffer = this.GL.createBuffer(),
                this.immediateMode.colorBuffer = this.GL.createBuffer()) : (this.immediateMode.vertexPositions.length = 0,
                this.immediateMode.vertexColors.length = 0),
                this.isImmediateDrawing = !0,
                this
            }
            ,
            n.RendererGL.prototype.vertex = function(t, e, r) {
                this.immediateMode.vertexPositions.push(t, e, r);
                var n = this.curFillColor || [.5, .5, .5, 1];
                return this.immediateMode.vertexColors.push(n[0], n[1], n[2], n[3]),
                this
            }
            ,
            n.RendererGL.prototype.endShape = function(t, e, r, n, o, s) {
                var a = this.GL;
                if (this._bindImmediateBuffers(this.immediateMode.vertexPositions, this.immediateMode.vertexColors),
                t)
                    if ("fill" === this.drawMode)
                        switch (this.immediateMode.shapeMode) {
                        case i.LINE_STRIP:
                            this.immediateMode.shapeMode = i.TRIANGLE_FAN;
                            break;
                        case i.LINES:
                            this.immediateMode.shapeMode = i.TRIANGLE_FAN;
                            break;
                        case i.TRIANGLES:
                            this.immediateMode.shapeMode = i.TRIANGLE_FAN
                        }
                    else
                        switch (this.immediateMode.shapeMode) {
                        case i.LINE_STRIP:
                            this.immediateMode.shapeMode = i.LINE_LOOP;
                            break;
                        case i.LINES:
                            this.immediateMode.shapeMode = i.LINE_LOOP
                        }
                if (this.immediateMode.shapeMode === i.QUADS || this.immediateMode.shapeMode === i.QUAD_STRIP)
                    throw new Error("sorry, " + this.immediateMode.shapeMode + " not yet implemented in webgl mode.");
                return a.enable(a.BLEND),
                a.drawArrays(this.immediateMode.shapeMode, 0, this.immediateMode.vertexPositions.length / 3),
                this.immediateMode.vertexPositions.length = 0,
                this.immediateMode.vertexColors.length = 0,
                this.isImmediateDrawing = !1,
                this
            }
            ,
            n.RendererGL.prototype._bindImmediateBuffers = function(t, e) {
                this._setDefaultCamera();
                var r = this.GL
                  , n = this._getCurShaderId()
                  , i = this.mHash[n];
                return i.vertexPositionAttribute = r.getAttribLocation(i, "aPosition"),
                r.enableVertexAttribArray(i.vertexPositionAttribute),
                r.bindBuffer(r.ARRAY_BUFFER, this.immediateMode.vertexBuffer),
                r.bufferData(r.ARRAY_BUFFER, new Float32Array(t), r.DYNAMIC_DRAW),
                r.vertexAttribPointer(i.vertexPositionAttribute, 3, r.FLOAT, !1, 0, 0),
                i.vertexColorAttribute = r.getAttribLocation(i, "aVertexColor"),
                r.enableVertexAttribArray(i.vertexColorAttribute),
                r.bindBuffer(r.ARRAY_BUFFER, this.immediateMode.colorBuffer),
                r.bufferData(r.ARRAY_BUFFER, new Float32Array(e), r.DYNAMIC_DRAW),
                r.vertexAttribPointer(i.vertexColorAttribute, 4, r.FLOAT, !1, 0, 0),
                this._setMatrixUniforms(n),
                this
            }
            ,
            n.RendererGL.prototype._getColorVertexShader = function() {
                var t, e = this.GL, r = "immediateVert|vertexColorFrag";
                return this.materialInHash(r) ? t = this.mHash[r] : (t = this._initShaders("immediateVert", "vertexColorFrag", !0),
                this.mHash[r] = t,
                t.vertexColorAttribute = e.getAttribLocation(t, "aVertexColor"),
                e.enableVertexAttribArray(t.vertexColorAttribute)),
                t
            }
            ,
            e.exports = n.RendererGL
        }
        , {
            "../core/constants": 36,
            "../core/core": 37
        }],
        85: [function(t, e, r) {
            "use strict";
            function n(t) {
                return t.length > 0 ? t.reduce(function(t, e) {
                    return t.concat(e)
                }) : []
            }
            function i(t) {
                return n(t.map(function(t) {
                    return [t.x, t.y, t.z]
                }))
            }
            var o = t("../core/core")
              , s = 0;
            o.RendererGL.prototype._initBufferDefaults = function(t) {
                if (s++,
                s > 1e3) {
                    var e = Object.keys(this.gHash)[0];
                    delete this.gHash[e],
                    s--
                }
                var r = this.GL;
                this.gHash[t] = {},
                this.gHash[t].vertexBuffer = r.createBuffer(),
                this.gHash[t].normalBuffer = r.createBuffer(),
                this.gHash[t].uvBuffer = r.createBuffer(),
                this.gHash[t].indexBuffer = r.createBuffer()
            }
            ,
            o.RendererGL.prototype.createBuffers = function(t, e) {
                var r = this.GL;
                this._setDefaultCamera(),
                this._initBufferDefaults(t);
                var o = this.mHash[this._getCurShaderId()];
                this.gHash[t].numberOfItems = 3 * e.faces.length,
                r.bindBuffer(r.ARRAY_BUFFER, this.gHash[t].vertexBuffer),
                r.bufferData(r.ARRAY_BUFFER, new Float32Array(i(e.vertices)), r.STATIC_DRAW),
                o.vertexPositionAttribute = r.getAttribLocation(o, "aPosition"),
                r.enableVertexAttribArray(o.vertexPositionAttribute),
                r.vertexAttribPointer(o.vertexPositionAttribute, 3, r.FLOAT, !1, 0, 0),
                r.bindBuffer(r.ARRAY_BUFFER, this.gHash[t].normalBuffer),
                r.bufferData(r.ARRAY_BUFFER, new Float32Array(i(e.vertexNormals)), r.STATIC_DRAW),
                o.vertexNormalAttribute = r.getAttribLocation(o, "aNormal"),
                r.enableVertexAttribArray(o.vertexNormalAttribute),
                r.vertexAttribPointer(o.vertexNormalAttribute, 3, r.FLOAT, !1, 0, 0),
                r.bindBuffer(r.ARRAY_BUFFER, this.gHash[t].uvBuffer),
                r.bufferData(r.ARRAY_BUFFER, new Float32Array(n(e.uvs)), r.STATIC_DRAW),
                o.textureCoordAttribute = r.getAttribLocation(o, "aTexCoord"),
                r.enableVertexAttribArray(o.textureCoordAttribute),
                r.vertexAttribPointer(o.textureCoordAttribute, 2, r.FLOAT, !1, 0, 0),
                r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, this.gHash[t].indexBuffer),
                r.bufferData(r.ELEMENT_ARRAY_BUFFER, new Uint16Array(n(e.faces)), r.STATIC_DRAW)
            }
            ,
            o.RendererGL.prototype.drawBuffers = function(t) {
                this._setDefaultCamera();
                var e = this.GL
                  , r = this._getCurShaderId()
                  , n = this.mHash[r];
                return e.bindBuffer(e.ARRAY_BUFFER, this.gHash[t].vertexBuffer),
                e.vertexAttribPointer(n.vertexPositionAttribute, 3, e.FLOAT, !1, 0, 0),
                e.bindBuffer(e.ARRAY_BUFFER, this.gHash[t].normalBuffer),
                e.vertexAttribPointer(n.vertexNormalAttribute, 3, e.FLOAT, !1, 0, 0),
                e.bindBuffer(e.ARRAY_BUFFER, this.gHash[t].uvBuffer),
                e.vertexAttribPointer(n.textureCoordAttribute, 2, e.FLOAT, !1, 0, 0),
                e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.gHash[t].indexBuffer),
                this._setMatrixUniforms(r),
                e.drawElements(e.TRIANGLES, this.gHash[t].numberOfItems, e.UNSIGNED_SHORT, 0),
                this
            }
            ,
            e.exports = o.RendererGL
        }
        , {
            "../core/core": 37
        }],
        86: [function(t, e, r) {
            "use strict";
            var n = t("../core/core")
              , i = t("./shader");
            t("../core/p5.Renderer"),
            t("./p5.Matrix");
            var o = []
              , s = 1e3
              , a = {
                alpha: !0,
                depth: !0,
                stencil: !0,
                antialias: !1,
                premultipliedAlpha: !1,
                preserveDrawingBuffer: !1
            };
            n.RendererGL = function(t, e, r) {
                return n.Renderer.call(this, t, e, r),
                this._initContext(),
                this.isP3D = !0,
                this.GL = this.drawingContext,
                this.ambientLightCount = 0,
                this.directionalLightCount = 0,
                this.pointLightCount = 0,
                this._isSetCamera = !1,
                this.uMVMatrix = new n.Matrix,
                this.uPMatrix = new n.Matrix,
                this.uNMatrix = new n.Matrix("mat3"),
                this.gHash = {},
                this.mHash = {},
                this.isImmediateDrawing = !1,
                this.immediateMode = {},
                this.curFillColor = [.5, .5, .5, 1],
                this.curStrokeColor = [.5, .5, .5, 1],
                this.pointSize = 5,
                this
            }
            ,
            n.RendererGL.prototype = Object.create(n.Renderer.prototype),
            n.RendererGL.prototype._initContext = function() {
                try {
                    if (this.drawingContext = this.canvas.getContext("webgl", a) || this.canvas.getContext("experimental-webgl", a),
                    null === this.drawingContext)
                        throw new Error("Error creating webgl context");
                    console.log("p5.RendererGL: enabled webgl context");
                    var t = this.drawingContext;
                    t.enable(t.DEPTH_TEST),
                    t.depthFunc(t.LEQUAL),
                    t.viewport(0, 0, t.drawingBufferWidth, t.drawingBufferHeight)
                } catch (e) {
                    throw new Error(e)
                }
            }
            ,
            n.RendererGL.prototype._setDefaultCamera = function() {
                if (!this._isSetCamera) {
                    var t = this.width
                      , e = this.height;
                    this.uPMatrix = n.Matrix.identity(),
                    this.uPMatrix.perspective(60 / 180 * Math.PI, t / e, .1, 100),
                    this._isSetCamera = !0
                }
            }
            ,
            n.RendererGL.prototype._update = function() {
                this.uMVMatrix = n.Matrix.identity(),
                this.translate(0, 0, -800),
                this.ambientLightCount = 0,
                this.directionalLightCount = 0,
                this.pointLightCount = 0
            }
            ,
            n.RendererGL.prototype.background = function() {
                var t = this.GL
                  , e = this._pInst.color.apply(this._pInst, arguments)
                  , r = e.levels[0] / 255
                  , n = e.levels[1] / 255
                  , i = e.levels[2] / 255
                  , o = e.levels[3] / 255;
                t.clearColor(r, n, i, o),
                t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT)
            }
            ,
            n.RendererGL.prototype._initShaders = function(t, e, r) {
                var n = this.GL
                  , o = n.createShader(n.VERTEX_SHADER);
                if (n.shaderSource(o, i[t]),
                n.compileShader(o),
                !n.getShaderParameter(o, n.COMPILE_STATUS))
                    return alert("Yikes! An error occurred compiling the shaders:" + n.getShaderInfoLog(o)),
                    null;
                var s = n.createShader(n.FRAGMENT_SHADER);
                if (n.shaderSource(s, i[e]),
                n.compileShader(s),
                !n.getShaderParameter(s, n.COMPILE_STATUS))
                    return alert("Darn! An error occurred compiling the shaders:" + n.getShaderInfoLog(s)),
                    null;
                var a = n.createProgram();
                return n.attachShader(a, o),
                n.attachShader(a, s),
                n.linkProgram(a),
                n.getProgramParameter(a, n.LINK_STATUS) || alert("Snap! Error linking shader program"),
                this._getLocation(a, r),
                a
            }
            ,
            n.RendererGL.prototype._getLocation = function(t, e) {
                var r = this.GL;
                r.useProgram(t),
                t.uResolution = r.getUniformLocation(t, "uResolution"),
                r.uniform1f(t.uResolution, s),
                t.uPMatrixUniform = r.getUniformLocation(t, "uProjectionMatrix"),
                t.uMVMatrixUniform = r.getUniformLocation(t, "uModelViewMatrix"),
                void 0 === e && (t.uNMatrixUniform = r.getUniformLocation(t, "uNormalMatrix"),
                t.samplerUniform = r.getUniformLocation(t, "uSampler"))
            }
            ,
            n.RendererGL.prototype._setUniform1f = function(t, e, r) {
                var n = this.GL
                  , i = this.mHash[t];
                return n.useProgram(i),
                i[e] = n.getUniformLocation(i, e),
                n.uniform1f(i[e], r),
                this
            }
            ,
            n.RendererGL.prototype._setMatrixUniforms = function(t) {
                var e = this.GL
                  , r = this.mHash[t];
                e.useProgram(r),
                e.uniformMatrix4fv(r.uPMatrixUniform, !1, this.uPMatrix.mat4),
                e.uniformMatrix4fv(r.uMVMatrixUniform, !1, this.uMVMatrix.mat4),
                e.uniformMatrix3fv(r.uNMatrixUniform, !1, this.uNMatrix.mat3)
            }
            ,
            n.RendererGL.prototype._getShader = function(t, e, r) {
                var n = t + "|" + e;
                if (!this.materialInHash(n)) {
                    var i = this._initShaders(t, e, r);
                    this.mHash[n] = i
                }
                return this.curShaderId = n,
                this.mHash[this.curShaderId]
            }
            ,
            n.RendererGL.prototype._getCurShaderId = function() {
                var t, e;
                return "fill" !== this.drawMode && void 0 === this.curShaderId ? (t = "normalVert|normalFrag",
                e = this._initShaders("normalVert", "normalFrag"),
                this.mHash[t] = e,
                this.curShaderId = t) : this.isImmediateDrawing && "fill" === this.drawMode && (t = "immediateVert|vertexColorFrag",
                e = this._initShaders("immediateVert", "vertexColorFrag"),
                this.mHash[t] = e,
                this.curShaderId = t),
                this.curShaderId
            }
            ,
            n.RendererGL.prototype.fill = function(t, e, r, n) {
                var i, o = this.GL, s = this._applyColorBlend(t, e, r, n);
                return this.curFillColor = s,
                this.drawMode = "fill",
                this.isImmediateDrawing ? (i = this._getShader("immediateVert", "vertexColorFrag"),
                o.useProgram(i)) : (i = this._getShader("normalVert", "basicFrag"),
                o.useProgram(i),
                i.uMaterialColor = o.getUniformLocation(i, "uMaterialColor"),
                o.uniform4f(i.uMaterialColor, s[0], s[1], s[2], s[3])),
                this
            }
            ,
            n.RendererGL.prototype.stroke = function(t, e, r, n) {
                var i = this._pInst.color.apply(this._pInst, arguments)
                  , o = i._array;
                return this.curStrokeColor = o,
                this.drawMode = "stroke",
                this
            }
            ,
            n.RendererGL.prototype._strokeCheck = function() {
                if ("stroke" === this.drawMode)
                    throw new Error("stroke for shapes in 3D not yet implemented, use fill for now :(")
            }
            ,
            n.RendererGL.prototype.strokeWeight = function(t) {
                return this.pointSize = t,
                this
            }
            ,
            n.RendererGL.prototype.geometryInHash = function(t) {
                return void 0 !== this.gHash[t]
            }
            ,
            n.RendererGL.prototype.materialInHash = function(t) {
                return void 0 !== this.mHash[t]
            }
            ,
            n.RendererGL.prototype.resize = function(t, e) {
                var r = this.GL;
                n.Renderer.prototype.resize.call(this, t, e),
                r.viewport(0, 0, r.drawingBufferWidth, r.drawingBufferHeight)
            }
            ,
            n.RendererGL.prototype.clear = function() {
                var t = this.GL;
                t.clearColor(arguments[0], arguments[1], arguments[2], arguments[3]),
                t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT)
            }
            ,
            n.RendererGL.prototype.translate = function(t, e, r) {
                return t /= s,
                e = -e / s,
                r /= s,
                this.uMVMatrix.translate([t, e, r]),
                this
            }
            ,
            n.RendererGL.prototype.scale = function(t, e, r) {
                return this.uMVMatrix.scale([t, e, r]),
                this
            }
            ,
            n.RendererGL.prototype.rotate = function(t, e) {
                return this.uMVMatrix.rotate(t, e),
                this.uNMatrix.inverseTranspose(this.uMVMatrix),
                this
            }
            ,
            n.RendererGL.prototype.rotateX = function(t) {
                return this.rotate(t, [1, 0, 0]),
                this
            }
            ,
            n.RendererGL.prototype.rotateY = function(t) {
                return this.rotate(t, [0, 1, 0]),
                this
            }
            ,
            n.RendererGL.prototype.rotateZ = function(t) {
                return this.rotate(t, [0, 0, 1]),
                this
            }
            ,
            n.RendererGL.prototype.push = function() {
                o.push(this.uMVMatrix.copy())
            }
            ,
            n.RendererGL.prototype.pop = function() {
                if (0 === o.length)
                    throw new Error("Invalid popMatrix!");
                this.uMVMatrix = o.pop()
            }
            ,
            n.RendererGL.prototype.resetMatrix = function() {
                return this.uMVMatrix = n.Matrix.identity(),
                this.translate(0, 0, -800),
                this
            }
            ,
            n.RendererGL.prototype._applyTextProperties = function() {
                console.error("text commands not yet implemented in webgl")
            }
            ,
            e.exports = n.RendererGL
        }
        , {
            "../core/core": 37,
            "../core/p5.Renderer": 43,
            "./p5.Matrix": 83,
            "./shader": 88
        }],
        87: [function(t, e, r) {
            "use strict";
            var n = t("../core/core");
            t("./p5.Geometry"),
            n.prototype.plane = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                var r = t[0] || 50
                  , i = t[1] || r
                  , o = "number" == typeof t[2] ? t[2] : 1
                  , s = "number" == typeof t[3] ? t[3] : 1
                  , a = "plane|" + r + "|" + i + "|" + o + "|" + s;
                if (!this._renderer.geometryInHash(a)) {
                    var h = function() {
                        for (var t, e, o, s = 0; s <= this.detailY; s++) {
                            e = s / this.detailY;
                            for (var a = 0; a <= this.detailX; a++)
                                t = a / this.detailX,
                                o = new n.Vector(r * t - r / 2,i * e - i / 2,0),
                                this.vertices.push(o),
                                this.uvs.push([t, e])
                        }
                    }
                      , u = new n.Geometry(o,s,h);
                    u.computeFaces().computeNormals(),
                    this._renderer.createBuffers(a, u)
                }
                this._renderer.drawBuffers(a)
            }
            ,
            n.prototype.box = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                var r = t[0] || 50
                  , i = t[1] || r
                  , o = t[2] || r
                  , s = "number" == typeof t[3] ? t[3] : 4
                  , a = "number" == typeof t[4] ? t[4] : 4
                  , h = "box|" + r + "|" + i + "|" + o + "|" + s + "|" + a;
                if (!this._renderer.geometryInHash(h)) {
                    var u = function() {
                        for (var t = [[0, 4, 2, 6], [1, 3, 5, 7], [0, 1, 4, 5], [2, 6, 3, 7], [0, 2, 1, 3], [4, 5, 6, 7]], e = 0, s = 0; s < t.length; s++) {
                            for (var a = t[s], h = 4 * s, u = 0; 4 > u; u++) {
                                var l = a[u]
                                  , p = new n.Vector((2 * (1 & l) - 1) * r / 2,((2 & l) - 1) * i / 2,((4 & l) / 2 - 1) * o / 2);
                                this.vertices.push(p),
                                this.uvs.push([1 & u, (2 & u) / 2]),
                                e++
                            }
                            this.faces.push([h, h + 1, h + 2]),
                            this.faces.push([h + 2, h + 1, h + 3])
                        }
                    }
                      , l = new n.Geometry(s,a,u);
                    l.computeNormals(),
                    this._renderer.createBuffers(h, l)
                }
                return this._renderer.drawBuffers(h),
                this
            }
            ,
            n.prototype.sphere = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                var r = t[0] || 50
                  , i = "number" == typeof t[1] ? t[1] : 24
                  , o = "number" == typeof t[2] ? t[2] : 16
                  , s = "sphere|" + r + "|" + i + "|" + o;
                if (!this._renderer.geometryInHash(s)) {
                    var a = function() {
                        for (var t, e, i, o = 0; o <= this.detailY; o++) {
                            e = o / this.detailY;
                            for (var s = 0; s <= this.detailX; s++) {
                                t = s / this.detailX;
                                var a = 2 * Math.PI * t
                                  , h = Math.PI * e - Math.PI / 2;
                                i = new n.Vector(r * Math.cos(h) * Math.sin(a),r * Math.sin(h),r * Math.cos(h) * Math.cos(a)),
                                this.vertices.push(i),
                                this.uvs.push([t, e])
                            }
                        }
                    }
                      , h = new n.Geometry(i,o,a);
                    h.computeFaces().computeNormals(),
                    this._renderer.createBuffers(s, h)
                }
                return this._renderer.drawBuffers(s),
                this
            }
            ;
            var i = function(t, e, r, i, o, s, a) {
                i = 3 > i ? 3 : i,
                o = 1 > o ? 1 : o,
                s = void 0 === s ? !0 : s,
                a = void 0 === a ? !0 : a;
                var h, u, l = (s ? 2 : 0) + (a ? 2 : 0), p = i + 1, c = Math.atan2(t - e, r), d = s ? -2 : 0, f = o + (a ? 2 : 0);
                for (h = d; f >= h; ++h) {
                    var m, y = h / o, g = r * y;
                    for (0 > h ? (g = 0,
                    y = 1,
                    m = t) : h > o ? (g = r,
                    y = 1,
                    m = e) : m = t + (e - t) * (h / o),
                    (-2 === h || h === o + 2) && (m = 0,
                    y = 0),
                    g -= r / 2,
                    u = 0; p > u; ++u)
                        this.vertices.push(new n.Vector(Math.sin(u * Math.PI * 2 / i) * m,g,Math.cos(u * Math.PI * 2 / i) * m)),
                        this.vertexNormals.push(new n.Vector(0 > h || h > o ? 0 : Math.sin(u * Math.PI * 2 / i) * Math.cos(c),0 > h ? -1 : h > o ? 1 : Math.sin(c),0 > h || h > o ? 0 : Math.cos(u * Math.PI * 2 / i) * Math.cos(c))),
                        this.uvs.push([u / i, y])
                }
                for (h = 0; o + l > h; ++h)
                    for (u = 0; i > u; ++u)
                        this.faces.push([p * (h + 0) + 0 + u, p * (h + 0) + 1 + u, p * (h + 1) + 1 + u]),
                        this.faces.push([p * (h + 0) + 0 + u, p * (h + 1) + 1 + u, p * (h + 1) + 0 + u])
            };
            n.prototype.cylinder = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                var r = t[0] || 50
                  , o = t[1] || r
                  , s = "number" == typeof t[2] ? t[2] : 24
                  , a = "number" == typeof t[3] ? t[3] : 16
                  , h = "cylinder|" + r + "|" + o + "|" + s + "|" + a;
                if (!this._renderer.geometryInHash(h)) {
                    var u = new n.Geometry(s,a);
                    i.call(u, r, r, o, s, a, !0, !0),
                    u.computeNormals(),
                    this._renderer.createBuffers(h, u)
                }
                return this._renderer.drawBuffers(h),
                this
            }
            ,
            n.prototype.cone = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                var r = t[0] || 50
                  , o = t[1] || r
                  , s = "number" == typeof t[2] ? t[2] : 24
                  , a = "number" == typeof t[3] ? t[3] : 16
                  , h = "cone|" + r + "|" + o + "|" + s + "|" + a;
                if (!this._renderer.geometryInHash(h)) {
                    var u = new n.Geometry(s,a);
                    i.call(u, r, 0, o, s, a, !0, !0),
                    u.computeNormals(),
                    this._renderer.createBuffers(h, u)
                }
                return this._renderer.drawBuffers(h),
                this
            }
            ,
            n.prototype.ellipsoid = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                var r = "number" == typeof t[3] ? t[3] : 24
                  , i = "number" == typeof t[4] ? t[4] : 24
                  , o = t[0] || 50
                  , s = t[1] || o
                  , a = t[2] || o
                  , h = "ellipsoid|" + o + "|" + s + "|" + a + "|" + r + "|" + i;
                if (!this._renderer.geometryInHash(h)) {
                    var u = function() {
                        for (var t, e, r, i = 0; i <= this.detailY; i++) {
                            e = i / this.detailY;
                            for (var h = 0; h <= this.detailX; h++) {
                                t = h / this.detailX;
                                var u = 2 * Math.PI * t
                                  , l = Math.PI * e - Math.PI / 2;
                                r = new n.Vector(o * Math.cos(l) * Math.sin(u),s * Math.sin(l),a * Math.cos(l) * Math.cos(u)),
                                this.vertices.push(r),
                                this.uvs.push([t, e])
                            }
                        }
                    }
                      , l = new n.Geometry(r,i,u);
                    l.computeFaces().computeNormals(),
                    this._renderer.createBuffers(h, l)
                }
                return this._renderer.drawBuffers(h),
                this
            }
            ,
            n.prototype.torus = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                var r = "number" == typeof t[2] ? t[2] : 24
                  , i = "number" == typeof t[3] ? t[3] : 16
                  , o = t[0] || 50
                  , s = t[1] || 10
                  , a = "torus|" + o + "|" + s + "|" + r + "|" + i;
                if (!this._renderer.geometryInHash(a)) {
                    var h = function() {
                        for (var t, e, r, i = 0; i <= this.detailY; i++) {
                            e = i / this.detailY;
                            for (var a = 0; a <= this.detailX; a++) {
                                t = a / this.detailX;
                                var h = 2 * Math.PI * t
                                  , u = 2 * Math.PI * e;
                                r = new n.Vector((o + s * Math.cos(u)) * Math.cos(h),(o + s * Math.cos(u)) * Math.sin(h),s * Math.sin(u)),
                                this.vertices.push(r),
                                this.uvs.push([t, e])
                            }
                        }
                    }
                      , u = new n.Geometry(r,i,h);
                    u.computeFaces().computeNormals(),
                    this._renderer.createBuffers(a, u)
                }
                return this._renderer.drawBuffers(a),
                this
            }
            ,
            n.RendererGL.prototype.point = function(t, e, r) {
                return console.log("point not yet implemented in webgl"),
                this
            }
            ,
            n.RendererGL.prototype.triangle = function(t) {
                var e = t[0]
                  , r = t[1]
                  , i = t[2]
                  , o = t[3]
                  , s = t[4]
                  , a = t[5]
                  , h = t[6]
                  , u = t[7]
                  , l = t[8]
                  , p = "tri|" + e + "|" + r + "|" + i + "|" + o + "|" + s + "|" + a + h + "|" + u + "|" + l;
                if (!this.geometryInHash(p)) {
                    var c = function() {
                        var t = [];
                        t.push(new n.Vector(e,r,i)),
                        t.push(new n.Vector(o,s,a)),
                        t.push(new n.Vector(h,u,l)),
                        this.vertices = t,
                        this.faces = [[0, 1, 2]],
                        this.uvs = [[0, 0], [0, 1], [1, 1]]
                    }
                      , d = new n.Geometry(1,1,c);
                    d.computeNormals(),
                    this.createBuffers(p, d)
                }
                return this.drawBuffers(p),
                this
            }
            ,
            n.RendererGL.prototype.ellipse = function(t) {
                var e = t[0]
                  , r = t[1]
                  , i = t[2]
                  , o = t[3]
                  , s = t[4]
                  , a = t[5] || 24
                  , h = t[6] || 16
                  , u = "ellipse|" + t[0] + "|" + t[1] + "|" + t[2] + "|" + t[3] + "|" + t[4];
                if (!this.geometryInHash(u)) {
                    var l = function() {
                        for (var t, a, h, u = 0; u <= this.detailY; u++) {
                            a = u / this.detailY;
                            for (var l = 0; l <= this.detailX; l++) {
                                t = l / this.detailX;
                                var p = 2 * Math.PI * t;
                                if (0 === a)
                                    h = new n.Vector(e,r,i);
                                else {
                                    var c = e + o * Math.sin(p)
                                      , d = r + s * Math.cos(p)
                                      , f = i;
                                    h = new n.Vector(c,d,f)
                                }
                                this.vertices.push(h),
                                this.uvs.push([t, a])
                            }
                        }
                    }
                      , p = new n.Geometry(a,h,l);
                    p.computeFaces().computeNormals(),
                    this.createBuffers(u, p)
                }
                return this.drawBuffers(u),
                this
            }
            ,
            n.RendererGL.prototype.rect = function(t) {
                var e = "rect|" + t[0] + "|" + t[1] + "|" + t[2] + "|" + t[3] + "|" + t[4]
                  , r = t[0]
                  , i = t[1]
                  , o = t[2]
                  , s = t[3]
                  , a = t[4]
                  , h = t[5] || 24
                  , u = t[6] || 16;
                if (!this.geometryInHash(e)) {
                    var l = function() {
                        for (var t, e, h, u = 0; u <= this.detailY; u++) {
                            e = u / this.detailY;
                            for (var l = 0; l <= this.detailX; l++)
                                t = l / this.detailX,
                                h = new n.Vector((r + s) * t,(i + a) * e,o),
                                this.vertices.push(h),
                                this.uvs.push([t, e])
                        }
                    }
                      , p = new n.Geometry(h,u,l);
                    p.computeFaces().computeNormals(),
                    this.createBuffers(e, p)
                }
                return this.drawBuffers(e),
                this
            }
            ,
            n.RendererGL.prototype.quad = function() {
                for (var t = new Array(arguments.length), e = 0; e < t.length; ++e)
                    t[e] = arguments[e];
                var r = t[0]
                  , i = t[1]
                  , o = t[2]
                  , s = t[3]
                  , a = t[4]
                  , h = t[5]
                  , u = t[6]
                  , l = t[7]
                  , p = t[8]
                  , c = t[9]
                  , d = t[10]
                  , f = t[11]
                  , m = "quad|" + r + "|" + i + "|" + o + "|" + s + "|" + a + "|" + h + u + "|" + l + "|" + p + c + "|" + d + "|" + f;
                if (!this.geometryInHash(m)) {
                    var y = function() {
                        this.vertices.push(new n.Vector(r,i,o)),
                        this.vertices.push(new n.Vector(s,a,h)),
                        this.vertices.push(new n.Vector(u,l,p)),
                        this.vertices.push(new n.Vector(c,d,f)),
                        this.uvs.push([0, 0], [1, 0], [1, 1], [0, 1])
                    }
                      , g = new n.Geometry(2,2,y);
                    g.computeNormals(),
                    g.faces = [[0, 1, 2], [2, 3, 0]],
                    this.createBuffers(m, g)
                }
                return this.drawBuffers(m),
                this
            }
            ,
            n.RendererGL.prototype.bezier = function(t) {
                var e = t[12] || 20;
                this.beginShape();
                for (var r = [0, 0, 0, 0], n = [0, 0, 0], i = 0; e >= i; i++)
                    r[0] = Math.pow(1 - i / e, 3),
                    r[1] = 3 * (i / e) * Math.pow(1 - i / e, 2),
                    r[2] = 3 * Math.pow(i / e, 2) * (1 - i / e),
                    r[3] = Math.pow(i / e, 3),
                    n[0] = t[0] * r[0] + t[3] * r[1] + t[6] * r[2] + t[9] * r[3],
                    n[1] = t[1] * r[0] + t[4] * r[1] + t[7] * r[2] + t[10] * r[3],
                    n[2] = t[2] * r[0] + t[5] * r[1] + t[8] * r[2] + t[11] * r[3],
                    this.vertex(n[0], n[1], n[2]);
                return this.endShape(),
                this
            }
            ,
            n.RendererGL.prototype.curve = function(t) {
                var e = t[12];
                this.beginShape();
                for (var r = [0, 0, 0, 0], n = [0, 0, 0], i = 0; e >= i; i++)
                    r[0] = .5 * Math.pow(i / e, 3),
                    r[1] = .5 * Math.pow(i / e, 2),
                    r[2] = i / e * .5,
                    r[3] = .5,
                    n[0] = r[0] * (-t[0] + 3 * t[3] - 3 * t[6] + t[9]) + r[1] * (2 * t[0] - 5 * t[3] + 4 * t[6] - t[9]) + r[2] * (-t[0] + t[6]) + 2 * r[3] * t[3],
                    n[1] = r[0] * (-t[1] + 3 * t[4] - 3 * t[7] + t[10]) + r[1] * (2 * t[1] - 5 * t[4] + 4 * t[7] - t[10]) + r[2] * (-t[1] + t[7]) + 2 * r[3] * t[4],
                    n[2] = r[0] * (-t[2] + 3 * t[5] - 3 * t[8] + t[11]) + r[1] * (2 * t[2] - 5 * t[5] + 4 * t[8] - t[11]) + r[2] * (-t[2] + t[8]) + 2 * r[3] * t[5],
                    this.vertex(n[0], n[1], n[2]);
                return this.endShape(),
                this
            }
            ,
            e.exports = n
        }
        , {
            "../core/core": 37,
            "./p5.Geometry": 82
        }],
        88: [function(t, e, r) {
            e.exports = {
                immediateVert: "attribute vec3 aPosition;\nattribute vec4 aVertexColor;\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform float uResolution;\nuniform float uPointSize;\n\nvarying vec4 vColor;\nvoid main(void) {\n  vec4 positionVec4 = vec4(aPosition / uResolution *vec3(1.0, -1.0, 1.0), 1.0);\n  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;\n  vColor = aVertexColor;\n  gl_PointSize = uPointSize;\n}",
                vertexColorVert: "attribute vec3 aPosition;\nattribute vec4 aVertexColor;\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform float uResolution;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  vec4 positionVec4 = vec4(aPosition / uResolution * vec3(1.0, -1.0, 1.0), 1.0);\n  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;\n  vColor = aVertexColor;\n}",
                vertexColorFrag: "precision mediump float;\nvarying vec4 vColor;\nvoid main(void) {\n  gl_FragColor = vColor;\n}",
                normalVert: "attribute vec3 aPosition;\nattribute vec3 aNormal;\nattribute vec2 aTexCoord;\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\nuniform float uResolution;\n\nvarying vec3 vVertexNormal;\nvarying highp vec2 vVertTexCoord;\n\nvoid main(void) {\n  vec4 positionVec4 = vec4(aPosition / uResolution, 1.0);\n  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;\n  vVertexNormal = vec3( uNormalMatrix * aNormal );\n  vVertTexCoord = aTexCoord;\n}",
                normalFrag: "precision mediump float;\nvarying vec3 vVertexNormal;\nvoid main(void) {\n  gl_FragColor = vec4(vVertexNormal, 1.0);\n}",
                basicFrag: "precision mediump float;\nvarying vec3 vVertexNormal;\nuniform vec4 uMaterialColor;\nvoid main(void) {\n  gl_FragColor = uMaterialColor;\n}",
                lightVert: "attribute vec3 aPosition;\nattribute vec3 aNormal;\nattribute vec2 aTexCoord;\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\nuniform float uResolution;\nuniform int uAmbientLightCount;\nuniform int uDirectionalLightCount;\nuniform int uPointLightCount;\n\nuniform vec3 uAmbientColor[8];\nuniform vec3 uLightingDirection[8];\nuniform vec3 uDirectionalColor[8];\nuniform vec3 uPointLightLocation[8];\nuniform vec3 uPointLightColor[8];\nuniform bool uSpecular;\n\nvarying vec3 vVertexNormal;\nvarying vec2 vVertTexCoord;\nvarying vec3 vLightWeighting;\n\nvec3 ambientLightFactor = vec3(0.0, 0.0, 0.0);\nvec3 directionalLightFactor = vec3(0.0, 0.0, 0.0);\nvec3 pointLightFactor = vec3(0.0, 0.0, 0.0);\nvec3 pointLightFactor2 = vec3(0.0, 0.0, 0.0);\n\nvoid main(void){\n\n  vec4 positionVec4 = vec4(aPosition / uResolution, 1.0);\n  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;\n\n  vec3 vertexNormal = vec3( uNormalMatrix * aNormal );\n  vVertexNormal = vertexNormal;\n  vVertTexCoord = aTexCoord;\n\n  vec4 mvPosition = uModelViewMatrix * vec4(aPosition / uResolution, 1.0);\n  vec3 eyeDirection = normalize(-mvPosition.xyz);\n\n  float shininess = 32.0;\n  float specularFactor = 2.0;\n  float diffuseFactor = 0.3;\n\n  for(int i = 0; i < 8; i++){\n    if(uAmbientLightCount == i) break;\n    ambientLightFactor += uAmbientColor[i];\n  }\n\n  for(int j = 0; j < 8; j++){\n    if(uDirectionalLightCount == j) break;\n    vec3 dir = uLightingDirection[j];\n    float directionalLightWeighting = max(dot(vertexNormal, dir), 0.0);\n    directionalLightFactor += uDirectionalColor[j] * directionalLightWeighting;\n  }\n\n  for(int k = 0; k < 8; k++){\n    if(uPointLightCount == k) break;\n    vec3 loc = uPointLightLocation[k];\n    //loc = loc / uResolution;\n    vec3 lightDirection = normalize(loc - mvPosition.xyz);\n\n    float directionalLightWeighting = max(dot(vertexNormal, lightDirection), 0.0);\n    pointLightFactor += uPointLightColor[k] * directionalLightWeighting;\n\n    //factor2 for specular\n    vec3 reflectionDirection = reflect(-lightDirection, vertexNormal);\n    float specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess);\n\n    pointLightFactor2 += uPointLightColor[k] * (specularFactor * specularLightWeighting\n      +  directionalLightWeighting * diffuseFactor);\n  }\n  \n  if(!uSpecular){\n    vLightWeighting =  ambientLightFactor + directionalLightFactor + pointLightFactor;\n  }else{\n    vLightWeighting = ambientLightFactor + directionalLightFactor + pointLightFactor2;\n  }\n\n}",
                lightTextureFrag: "precision mediump float;\n\nuniform vec4 uMaterialColor;\nuniform sampler2D uSampler;\nuniform bool isTexture;\n\nvarying vec3 vLightWeighting;\nvarying highp vec2 vVertTexCoord;\n\nvoid main(void) {\n  if(!isTexture){\n    gl_FragColor = vec4(vec3(uMaterialColor.rgb * vLightWeighting), uMaterialColor.a);\n  }else{\n    vec4 textureColor = texture2D(uSampler, vVertTexCoord);\n    if(vLightWeighting == vec3(0., 0., 0.)){\n      gl_FragColor = textureColor;\n    }else{\n      gl_FragColor = vec4(vec3(textureColor.rgb * vLightWeighting), textureColor.a); \n    }\n  }\n}"
            }
        }
        , {}]
    }, {}, [28])(28)
}),
!function(t, e) {
    "function" == typeof define && define.amd ? define("p5.dom", ["p5"], function(t) {
        e(t)
    }) : e("object" == typeof exports ? require("../p5") : t.p5)
}(this, function(t) {
    function e(e) {
        var r = document;
        return "string" == typeof e && "#" === e[0] ? (e = e.slice(1),
        r = document.getElementById(e) || document) : e instanceof t.Element ? r = e.elt : e instanceof HTMLElement && (r = e),
        r
    }
    function r(e) {
        if ("INPUT" === e.tagName && "checkbox" === e.type) {
            var r = new t.Element(e);
            return r.checked = function() {
                return 0 === arguments.length ? this.elt.checked : (arguments[0] ? this.elt.checked = !0 : this.elt.checked = !1,
                this)
            }
            ,
            r
        }
        return "VIDEO" === e.tagName || "AUDIO" === e.tagName ? new t.MediaElement(e) : new t.Element(e)
    }
    function n(e, r, n) {
        var i = r._userNode ? r._userNode : document.body;
        i.appendChild(e);
        var o = n ? new t.MediaElement(e) : new t.Element(e);
        return r._elements.push(o),
        o
    }
    function i(t, e, r, i) {
        var o = document.createElement(e)
          , r = r || "";
        "string" == typeof r && (r = [r]);
        for (var s = 0; s < r.length; s++) {
            var a = document.createElement("source");
            a.src = r[s],
            o.appendChild(a)
        }
        if ("undefined" != typeof i) {
            var h = function() {
                i(),
                o.removeEventListener("canplaythrough", h)
            };
            o.addEventListener("canplaythrough", h)
        }
        var u = n(o, t, !0);
        return u.loadedmetadata = !1,
        o.addEventListener("loadedmetadata", function() {
            u.width = o.videoWidth,
            u.height = o.videoHeight,
            0 === u.elt.width && (u.elt.width = o.videoWidth),
            0 === u.elt.height && (u.elt.height = o.videoHeight),
            u.loadedmetadata = !0
        }),
        u
    }
    t.prototype.select = function(t, n) {
        var i = null
          , o = e(n);
        return "." === t[0] ? (t = t.slice(1),
        i = o.getElementsByClassName(t),
        i = i.length ? i[0] : null) : "#" === t[0] ? (t = t.slice(1),
        i = o.getElementById(t)) : (i = o.getElementsByTagName(t),
        i = i.length ? i[0] : null),
        i ? r(i) : null
    }
    ,
    t.prototype.selectAll = function(t, n) {
        var i, o = [], s = e(n);
        if ("." === t[0] ? (t = t.slice(1),
        i = s.getElementsByClassName(t)) : i = s.getElementsByTagName(t),
        i)
            for (var a = 0; a < i.length; a++) {
                var h = r(i[a]);
                o.push(h)
            }
        return o
    }
    ,
    t.prototype.removeElements = function(t) {
        for (var e = 0; e < this._elements.length; e++)
            this._elements[e].elt instanceof HTMLCanvasElement || this._elements[e].remove()
    }
    ;
    var o = ["div", "p", "span"];
    o.forEach(function(e) {
        var r = "create" + e.charAt(0).toUpperCase() + e.slice(1);
        t.prototype[r] = function(t) {
            var r = document.createElement(e);
            return r.innerHTML = void 0 === typeof t ? "" : t,
            n(r, this)
        }
    }),
    t.prototype.createImg = function() {
        var t, e = document.createElement("img"), r = arguments, i = function() {
            t.width = e.offsetWidth,
            t.height = e.offsetHeight,
            r.length > 1 && "function" == typeof r[1] ? (t.fn = r[1],
            t.fn()) : r.length > 1 && "function" == typeof r[2] && (t.fn = r[2],
            t.fn())
        };
        return e.src = r[0],
        r.length > 1 && "string" == typeof r[1] && (e.alt = r[1]),
        e.onload = function() {
            i()
        }
        ,
        t = n(e, this)
    }
    ,
    t.prototype.createA = function(t, e, r) {
        var i = document.createElement("a");
        return i.href = t,
        i.innerHTML = e,
        r && (i.target = r),
        n(i, this)
    }
    ,
    t.prototype.createSlider = function(t, e, r, i) {
        var o = document.createElement("input");
        return o.type = "range",
        o.min = t,
        o.max = e,
        i && (o.step = i),
        "number" == typeof r && (o.value = r),
        n(o, this)
    }
    ,
    t.prototype.createButton = function(t, e) {
        var r = document.createElement("button");
        return r.innerHTML = t,
        r.value = e,
        e && (r.value = e),
        n(r, this)
    }
    ,
    t.prototype.createCheckbox = function() {
        var t = document.createElement("div")
          , e = document.createElement("input");
        e.type = "checkbox",
        t.appendChild(e);
        var r = n(t, this);
        if (r.checked = function() {
            var t = r.elt.getElementsByTagName("input")[0];
            if (t) {
                if (0 === arguments.length)
                    return t.checked;
                arguments[0] ? t.checked = !0 : t.checked = !1
            }
            return r
        }
        ,
        this.value = function(t) {
            return r.value = t,
            this
        }
        ,
        arguments[0]) {
            var i = Math.random().toString(36).slice(2)
              , o = document.createElement("label");
            e.setAttribute("id", i),
            o.htmlFor = i,
            r.value(arguments[0]),
            o.appendChild(document.createTextNode(arguments[0])),
            t.appendChild(o)
        }
        return arguments[1] && (e.checked = !0),
        r
    }
    ,
    t.prototype.createSelect = function(t) {
        var e = document.createElement("select");
        t && e.setAttribute("multiple", "true");
        var r = n(e, this);
        return r.option = function(t, r) {
            var n = document.createElement("option");
            n.innerHTML = t,
            arguments.length > 1 ? n.value = r : n.value = t,
            e.appendChild(n)
        }
        ,
        r.selected = function(e) {
            var r = [];
            if (arguments.length > 0) {
                for (var n = 0; n < this.elt.length; n++)
                    e.toString() === this.elt[n].value && (this.elt.selectedIndex = n);
                return this
            }
            if (t) {
                for (var n = 0; n < this.elt.selectedOptions.length; n++)
                    r.push(this.elt.selectedOptions[n].value);
                return r
            }
            return this.elt.value
        }
        ,
        r
    }
    ,
    t.prototype.createRadio = function() {
        var t = document.querySelectorAll("input[type=radio]")
          , e = 0;
        if (t.length > 1) {
            console.log(t, t[0].name);
            var r = t.length
              , i = t[0].name
              , o = t[1].name;
            e = 1;
            for (var s = 1; r > s; s++)
                o = t[s].name,
                i != o && e++,
                i = o
        } else
            1 == t.length && (e = 1);
        var a = document.createElement("div")
          , h = n(a, this)
          , u = -1;
        return h.option = function(t, r) {
            var n = document.createElement("input");
            if (n.type = "radio",
            n.innerHTML = t,
            arguments.length > 1 ? n.value = r : n.value = t,
            n.setAttribute("name", "defaultradio" + e),
            a.appendChild(n),
            t) {
                u++;
                var i = (Math.random().toString(36).slice(2),
                document.createElement("label"));
                n.setAttribute("id", "defaultradio" + e + "-" + u),
                i.htmlFor = "defaultradio" + e + "-" + u,
                i.appendChild(document.createTextNode(t)),
                a.appendChild(i)
            }
            return n
        }
        ,
        h.selected = function() {
            var t = this.elt.childNodes.length;
            if (arguments[0]) {
                for (var e = 0; t > e; e += 2)
                    this.elt.childNodes[e].value == arguments[0] && (this.elt.childNodes[e].checked = !0);
                return this
            }
            for (var e = 0; t > e; e += 2)
                if (1 == this.elt.childNodes[e].checked)
                    return this.elt.childNodes[e].value
        }
        ,
        h.value = function() {
            var t = this.elt.childNodes.length;
            if (arguments[0]) {
                for (var e = 0; t > e; e += 2)
                    this.elt.childNodes[e].value == arguments[0] && (this.elt.childNodes[e].checked = !0);
                return this
            }
            for (var e = 0; t > e; e += 2)
                if (1 == this.elt.childNodes[e].checked)
                    return this.elt.childNodes[e].value;
            return ""
        }
        ,
        h
    }
    ,
    t.prototype.createInput = function(t) {
        var e = document.createElement("input");
        return e.type = "text",
        t && (e.value = t),
        n(e, this)
    }
    ,
    t.prototype.createFileInput = function(e, r) {
        function i(r) {
            function n(r) {
                var n = new t.File(r);
                return function(t) {
                    n.data = t.target.result,
                    e(n)
                }
            }
            for (var i = r.target.files, o = 0; o < i.length; o++) {
                var s = i[o]
                  , a = new FileReader;
                a.onload = n(s),
                s.type.indexOf("text") > -1 ? a.readAsText(s) : a.readAsDataURL(s)
            }
        }
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var o = document.createElement("input");
            return o.type = "file",
            r && (o.multiple = "multiple"),
            o.addEventListener("change", i, !1),
            n(o, this)
        }
        console.log("The File APIs are not fully supported in this browser. Cannot create element.")
    }
    ,
    t.prototype.createVideo = function(t, e) {
        return i(this, "video", t, e)
    }
    ,
    t.prototype.createAudio = function(t, e) {
        return i(this, "audio", t, e)
    }
    ,
    t.prototype.VIDEO = "video",
    t.prototype.AUDIO = "audio",
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia,
    t.prototype.createCapture = function() {
        for (var e, r, i = !0, o = !0, s = 0; s < arguments.length; s++)
            arguments[s] === t.prototype.VIDEO ? o = !1 : arguments[s] === t.prototype.AUDIO ? i = !1 : "object" == typeof arguments[s] ? e = arguments[s] : "function" == typeof arguments[s] && (r = arguments[s]);
        if (!navigator.getUserMedia)
            throw "getUserMedia not supported in this browser";
        var a = document.createElement("video");
        e || (e = {
            video: i,
            audio: o
        }),
        navigator.getUserMedia(e, function(t) {
            a.src = window.URL.createObjectURL(t),
            r && r(t)
        }, function(t) {
            console.log(t)
        });
        var h = n(a, this, !0);
        return h.loadedmetadata = !1,
        a.addEventListener("loadedmetadata", function() {
            a.play(),
            h.width = a.videoWidth = a.width,
            h.height = a.videoHeight = a.height,
            h.loadedmetadata = !0
        }),
        h
    }
    ,
    t.prototype.createElement = function(t, e) {
        var r = document.createElement(t);
        return "undefined" != typeof e && (r.innerHTML = e),
        n(r, this)
    }
    ,
    t.Element.prototype.addClass = function(t) {
        return this.elt.className ? this.elt.className = this.elt.className + " " + t : this.elt.className = t,
        this
    }
    ,
    t.Element.prototype.removeClass = function(t) {
        var e = new RegExp("(?:^|\\s)" + t + "(?!\\S)");
        return this.elt.className = this.elt.className.replace(e, ""),
        this.elt.className = this.elt.className.replace(/^\s+|\s+$/g, ""),
        this
    }
    ,
    t.Element.prototype.child = function(e) {
        return null === e ? this.elt.childNodes : ("string" == typeof e ? ("#" === e[0] && (e = e.substring(1)),
        e = document.getElementById(e)) : e instanceof t.Element && (e = e.elt),
        this.elt.appendChild(e),
        this)
    }
    ,
    t.Element.prototype.center = function(t) {
        var e = this.elt.style.display
          , r = "none" === this.elt.style.display
          , n = "none" === this.parent().style.display
          , i = {
            x: this.elt.offsetLeft,
            y: this.elt.offsetTop
        };
        r && this.show(),
        this.elt.style.display = "block",
        this.position(0, 0),
        n && (this.parent().style.display = "block");
        var o = Math.abs(this.parent().offsetWidth - this.elt.offsetWidth)
          , s = Math.abs(this.parent().offsetHeight - this.elt.offsetHeight)
          , a = i.y
          , h = i.x;
        return "both" === t || void 0 === t ? this.position(o / 2, s / 2) : "horizontal" === t ? this.position(o / 2, a) : "vertical" === t && this.position(h, s / 2),
        this.style("display", e),
        r && this.hide(),
        n && (this.parent().style.display = "none"),
        this
    }
    ,
    t.Element.prototype.html = function(t) {
        return "undefined" != typeof t ? (this.elt.innerHTML = t,
        this) : this.elt.innerHTML
    }
    ,
    t.Element.prototype.position = function() {
        return 0 === arguments.length ? {
            x: this.elt.offsetLeft,
            y: this.elt.offsetTop
        } : (this.elt.style.position = "absolute",
        this.elt.style.left = arguments[0] + "px",
        this.elt.style.top = arguments[1] + "px",
        this.x = arguments[0],
        this.y = arguments[1],
        this)
    }
    ,
    t.Element.prototype._translate = function() {
        this.elt.style.position = "absolute";
        var t = "";
        return this.elt.style.transform && (t = this.elt.style.transform.replace(/translate3d\(.*\)/g, ""),
        t = t.replace(/translate[X-Z]?\(.*\)/g, "")),
        2 === arguments.length ? this.elt.style.transform = "translate(" + arguments[0] + "px, " + arguments[1] + "px)" : arguments.length > 2 && (this.elt.style.transform = "translate3d(" + arguments[0] + "px," + arguments[1] + "px," + arguments[2] + "px)",
        3 === arguments.length ? this.elt.parentElement.style.perspective = "1000px" : this.elt.parentElement.style.perspective = arguments[3] + "px"),
        this.elt.style.transform += t,
        this
    }
    ,
    t.Element.prototype._rotate = function() {
        var t = "";
        if (this.elt.style.transform) {
            var t = this.elt.style.transform.replace(/rotate3d\(.*\)/g, "");
            t = t.replace(/rotate[X-Z]?\(.*\)/g, "")
        }
        return 1 === arguments.length ? this.elt.style.transform = "rotate(" + arguments[0] + "deg)" : 2 === arguments.length ? this.elt.style.transform = "rotate(" + arguments[0] + "deg, " + arguments[1] + "deg)" : 3 === arguments.length && (this.elt.style.transform = "rotateX(" + arguments[0] + "deg)",
        this.elt.style.transform += "rotateY(" + arguments[1] + "deg)",
        this.elt.style.transform += "rotateZ(" + arguments[2] + "deg)"),
        this.elt.style.transform += t,
        this
    }
    ,
    t.Element.prototype.style = function(e, r) {
        var n = this;
        if (r instanceof t.Color && (r = "rgba(" + r.levels[0] + "," + r.levels[1] + "," + r.levels[2] + "," + r.levels[3] / 255 + ")"),
        "undefined" == typeof r) {
            if (-1 === e.indexOf(":")) {
                var i = window.getComputedStyle(n.elt)
                  , o = i.getPropertyValue(e);
                return o
            }
            for (var s = e.split(";"), a = 0; a < s.length; a++) {
                var h = s[a].split(":");
                h[0] && h[1] && (this.elt.style[h[0].trim()] = h[1].trim())
            }
        } else if ("rotate" === e || "translate" === e || "position" === e) {
            var u = Array.prototype.shift.apply(arguments)
              , l = this[u] || this["_" + u];
            l.apply(this, arguments)
        } else if (this.elt.style[e] = r,
        "width" === e || "height" === e || "left" === e || "top" === e) {
            var p = r.replace(/\D+/g, "");
            this[e] = parseInt(p, 10)
        }
        return this
    }
    ,
    t.Element.prototype.attribute = function(t, e) {
        return "undefined" == typeof e ? this.elt.getAttribute(t) : (this.elt.setAttribute(t, e),
        this)
    }
    ,
    t.Element.prototype.value = function() {
        return arguments.length > 0 ? (this.elt.value = arguments[0],
        this) : "range" === this.elt.type ? parseFloat(this.elt.value) : this.elt.value
    }
    ,
    t.Element.prototype.show = function() {
        return this.elt.style.display = "block",
        this
    }
    ,
    t.Element.prototype.hide = function() {
        return this.elt.style.display = "none",
        this
    }
    ,
    t.Element.prototype.size = function(e, r) {
        if (0 === arguments.length)
            return {
                width: this.elt.offsetWidth,
                height: this.elt.offsetHeight
            };
        var n = e
          , i = r
          , o = t.prototype.AUTO;
        if (n !== o || i !== o) {
            if (n === o ? n = r * this.width / this.height : i === o && (i = e * this.height / this.width),
            this.elt instanceof HTMLCanvasElement) {
                var s = {}
                  , a = this.elt.getContext("2d");
                for (var h in a)
                    s[h] = a[h];
                this.elt.setAttribute("width", n * this._pInst._pixelDensity),
                this.elt.setAttribute("height", i * this._pInst._pixelDensity),
                this.elt.setAttribute("style", "width:" + n + "px; height:" + i + "px"),
                this._pInst.scale(this._pInst._pixelDensity, this._pInst._pixelDensity);
                for (var h in s)
                    this.elt.getContext("2d")[h] = s[h]
            } else
                this.elt.style.width = n + "px",
                this.elt.style.height = i + "px",
                this.elt.width = n,
                this.elt.height = i,
                this.width = n,
                this.height = i;
            this.width = this.elt.offsetWidth,
            this.height = this.elt.offsetHeight,
            this._pInst && this._pInst._curElement.elt === this.elt && (this._pInst._setProperty("width", this.elt.offsetWidth),
            this._pInst._setProperty("height", this.elt.offsetHeight))
        }
        return this
    }
    ,
    t.Element.prototype.remove = function() {
        for (var t in this._events)
            this.elt.removeEventListener(t, this._events[t]);
        this.elt.parentNode && this.elt.parentNode.removeChild(this.elt),
        delete this
    }
    ,
    t.MediaElement = function(e, r) {
        t.Element.call(this, e, r);
        var n = this;
        this.elt.crossOrigin = "anonymous",
        this._prevTime = 0,
        this._cueIDCounter = 0,
        this._cues = [],
        this._pixelDensity = 1,
        Object.defineProperty(n, "src", {
            get: function() {
                var t = n.elt.children[0].src
                  , e = n.elt.src === window.location.href ? "" : n.elt.src
                  , r = t === window.location.href ? e : t;
                return r
            },
            set: function(t) {
                for (var r = 0; r < n.elt.children.length; r++)
                    n.elt.removeChild(n.elt.children[r]);
                var i = document.createElement("source");
                i.src = t,
                e.appendChild(i),
                n.elt.src = t
            }
        }),
        n._onended = function() {}
        ,
        n.elt.onended = function() {
            n._onended(n)
        }
    }
    ,
    t.MediaElement.prototype = Object.create(t.Element.prototype),
    t.MediaElement.prototype.play = function() {
        return this.elt.currentTime === this.elt.duration && (this.elt.currentTime = 0),
        this.elt.readyState > 1 ? this.elt.play() : (this.elt.load(),
        this.elt.play()),
        this
    }
    ,
    t.MediaElement.prototype.stop = function() {
        return this.elt.pause(),
        this.elt.currentTime = 0,
        this
    }
    ,
    t.MediaElement.prototype.pause = function() {
        return this.elt.pause(),
        this
    }
    ,
    t.MediaElement.prototype.loop = function() {
        return this.elt.setAttribute("loop", !0),
        this.play(),
        this
    }
    ,
    t.MediaElement.prototype.noLoop = function() {
        return this.elt.setAttribute("loop", !1),
        this
    }
    ,
    t.MediaElement.prototype.autoplay = function(t) {
        return this.elt.setAttribute("autoplay", t),
        this
    }
    ,
    t.MediaElement.prototype.volume = function(t) {
        return "undefined" == typeof t ? this.elt.volume : void (this.elt.volume = t)
    }
    ,
    t.MediaElement.prototype.speed = function(t) {
        return "undefined" == typeof t ? this.elt.playbackRate : void (this.elt.playbackRate = t)
    }
    ,
    t.MediaElement.prototype.time = function(t) {
        return "undefined" == typeof t ? this.elt.currentTime : void (this.elt.currentTime = t)
    }
    ,
    t.MediaElement.prototype.duration = function() {
        return this.elt.duration
    }
    ,
    t.MediaElement.prototype.pixels = [],
    t.MediaElement.prototype.loadPixels = function() {
        return this.canvas || (this.canvas = document.createElement("canvas"),
        this.drawingContext = this.canvas.getContext("2d")),
        this.loadedmetadata && (this.canvas.width !== this.elt.width && (this.canvas.width = this.elt.width,
        this.canvas.height = this.elt.height,
        this.width = this.canvas.width,
        this.height = this.canvas.height),
        this.drawingContext.drawImage(this.elt, 0, 0, this.canvas.width, this.canvas.height),
        t.Renderer2D.prototype.loadPixels.call(this)),
        this
    }
    ,
    t.MediaElement.prototype.updatePixels = function(e, r, n, i) {
        return this.loadedmetadata && t.Renderer2D.prototype.updatePixels.call(this, e, r, n, i),
        this
    }
    ,
    t.MediaElement.prototype.get = function(e, r, n, i) {
        return this.loadedmetadata ? t.Renderer2D.prototype.get.call(this, e, r, n, i) : e ? [0, 0, 0, 255] : new t.Image(1,1)
    }
    ,
    t.MediaElement.prototype.set = function(e, r, n) {
        this.loadedmetadata && t.Renderer2D.prototype.set.call(this, e, r, n)
    }
    ,
    t.MediaElement.prototype.onended = function(t) {
        return this._onended = t,
        this
    }
    ,
    t.MediaElement.prototype.connect = function(e) {
        var r, n;
        if ("function" == typeof t.prototype.getAudioContext)
            r = t.prototype.getAudioContext(),
            n = t.soundOut.input;
        else
            try {
                r = e.context,
                n = r.destination
            } catch (i) {
                throw "connect() is meant to be used with Web Audio API or p5.sound.js"
            }
        this.audioSourceNode || (this.audioSourceNode = r.createMediaElementSource(this.elt),
        this.audioSourceNode.connect(n)),
        e ? e.input ? this.audioSourceNode.connect(e.input) : this.audioSourceNode.connect(e) : this.audioSourceNode.connect(n)
    }
    ,
    t.MediaElement.prototype.disconnect = function() {
        if (!this.audioSourceNode)
            throw "nothing to disconnect";
        this.audioSourceNode.disconnect()
    }
    ,
    t.MediaElement.prototype.showControls = function() {
        this.elt.style["text-align"] = "inherit",
        this.elt.controls = !0
    }
    ,
    t.MediaElement.prototype.hideControls = function() {
        this.elt.controls = !1
    }
    ,
    t.MediaElement.prototype.addCue = function(t, e, r) {
        var n = this._cueIDCounter++
          , i = new s(e,t,n,r);
        return this._cues.push(i),
        this.elt.ontimeupdate || (this.elt.ontimeupdate = this._onTimeUpdate.bind(this)),
        n
    }
    ,
    t.MediaElement.prototype.removeCue = function(t) {
        for (var e = 0; e < this._cues.length; e++) {
            var r = this._cues[e];
            r.id === t && this.cues.splice(e, 1)
        }
        0 === this._cues.length && (this.elt.ontimeupdate = null)
    }
    ,
    t.MediaElement.prototype.clearCues = function() {
        this._cues = [],
        this.elt.ontimeupdate = null
    }
    ,
    t.MediaElement.prototype._onTimeUpdate = function() {
        for (var t = this.time(), e = 0; e < this._cues.length; e++) {
            var r = this._cues[e].time
              , n = this._cues[e].val;
            this._prevTime < r && t >= r && this._cues[e].callback(n)
        }
        this._prevTime = t
    }
    ;
    var s = function(t, e, r, n) {
        this.callback = t,
        this.time = e,
        this.id = r,
        this.val = n
    };
    t.File = function(t, e) {
        this.file = t,
        this._pInst = e;
        var r = t.type.split("/");
        this.type = r[0],
        this.subtype = r[1],
        this.name = t.name,
        this.size = t.size,
        this.data = void 0
    }
}),
!function(t, e) {
    "function" == typeof define && define.amd ? define("p5.sound", ["p5"], function(t) {
        e(t)
    }) : e("object" == typeof exports ? require("../p5") : t.p5)
}(this, function(p5) {
    var sndcore;
    sndcore = function() {
        "use strict";
        !function(t, e, r) {
            function n(t) {
                t && (t.setTargetAtTime || (t.setTargetAtTime = t.setTargetValueAtTime))
            }
            return e = e || {},
            window.hasOwnProperty("webkitAudioContext") && !window.hasOwnProperty("AudioContext") && (window.AudioContext = webkitAudioContext,
            AudioContext.prototype.hasOwnProperty("createGain") || (AudioContext.prototype.createGain = AudioContext.prototype.createGainNode),
            AudioContext.prototype.hasOwnProperty("createDelay") || (AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode),
            AudioContext.prototype.hasOwnProperty("createScriptProcessor") || (AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode),
            AudioContext.prototype.hasOwnProperty("createPeriodicWave") || (AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable),
            AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain,
            AudioContext.prototype.createGain = function() {
                var t = this.internal_createGain();
                return n(t.gain),
                t
            }
            ,
            AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay,
            AudioContext.prototype.createDelay = function(t) {
                var e = t ? this.internal_createDelay(t) : this.internal_createDelay();
                return n(e.delayTime),
                e
            }
            ,
            AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource,
            AudioContext.prototype.createBufferSource = function() {
                var t = this.internal_createBufferSource();
                return t.start ? (t.internal_start = t.start,
                t.start = function(e, r, n) {
                    "undefined" != typeof n ? t.internal_start(e || 0, r, n) : t.internal_start(e || 0, r || 0)
                }
                ) : t.start = function(t, e, r) {
                    e || r ? this.noteGrainOn(t || 0, e, r) : this.noteOn(t || 0)
                }
                ,
                t.stop ? (t.internal_stop = t.stop,
                t.stop = function(e) {
                    t.internal_stop(e || 0)
                }
                ) : t.stop = function(t) {
                    this.noteOff(t || 0)
                }
                ,
                n(t.playbackRate),
                t
            }
            ,
            AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor,
            AudioContext.prototype.createDynamicsCompressor = function() {
                var t = this.internal_createDynamicsCompressor();
                return n(t.threshold),
                n(t.knee),
                n(t.ratio),
                n(t.reduction),
                n(t.attack),
                n(t.release),
                t
            }
            ,
            AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter,
            AudioContext.prototype.createBiquadFilter = function() {
                var t = this.internal_createBiquadFilter();
                return n(t.frequency),
                n(t.detune),
                n(t.Q),
                n(t.gain),
                t
            }
            ,
            AudioContext.prototype.hasOwnProperty("createOscillator") && (AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator,
            AudioContext.prototype.createOscillator = function() {
                var t = this.internal_createOscillator();
                return t.start ? (t.internal_start = t.start,
                t.start = function(e) {
                    t.internal_start(e || 0)
                }
                ) : t.start = function(t) {
                    this.noteOn(t || 0)
                }
                ,
                t.stop ? (t.internal_stop = t.stop,
                t.stop = function(e) {
                    t.internal_stop(e || 0)
                }
                ) : t.stop = function(t) {
                    this.noteOff(t || 0)
                }
                ,
                t.setPeriodicWave || (t.setPeriodicWave = t.setWaveTable),
                n(t.frequency),
                n(t.detune),
                t
            }
            )),
            window.hasOwnProperty("webkitOfflineAudioContext") && !window.hasOwnProperty("OfflineAudioContext") && (window.OfflineAudioContext = webkitOfflineAudioContext),
            e
        }(window);
        var t = new window.AudioContext;
        p5.prototype.getAudioContext = function() {
            return t
        }
        ,
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        var e = document.createElement("audio");
        p5.prototype.isSupported = function() {
            return !!e.canPlayType
        }
        ;
        var r = function() {
            return !!e.canPlayType && e.canPlayType('audio/ogg; codecs="vorbis"')
        }
          , n = function() {
            return !!e.canPlayType && e.canPlayType("audio/mpeg;");
        }
          , i = function() {
            return !!e.canPlayType && e.canPlayType('audio/wav; codecs="1"')
        }
          , o = function() {
            return !!e.canPlayType && (e.canPlayType("audio/x-m4a;") || e.canPlayType("audio/aac;"))
        }
          , s = function() {
            return !!e.canPlayType && e.canPlayType("audio/x-aiff;")
        };
        p5.prototype.isFileSupported = function(t) {
            switch (t.toLowerCase()) {
            case "mp3":
                return n();
            case "wav":
                return i();
            case "ogg":
                return r();
            case "mp4":
                return o();
            case "aiff":
                return s();
            default:
                return !1
            }
        }
        ;
        var a = !!navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
        if (a) {
            var h = !1
              , u = function() {
                if (!h) {
                    var e = t.createBuffer(1, 1, 22050)
                      , r = t.createBufferSource();
                    r.buffer = e,
                    r.connect(t.destination),
                    r.start(0),
                    console.log("start ios!"),
                    "running" === t.state && (h = !0)
                }
            };
            document.addEventListener("touchend", u, !1),
            document.addEventListener("touchstart", u, !1)
        }
    }();
    var master;
    master = function() {
        "use strict";
        var t = function() {
            var t = p5.prototype.getAudioContext();
            this.input = t.createGain(),
            this.output = t.createGain(),
            this.limiter = t.createDynamicsCompressor(),
            this.limiter.threshold.value = 0,
            this.limiter.ratio.value = 100,
            this.audiocontext = t,
            this.output.disconnect(),
            this.inputSources = [],
            this.input.connect(this.limiter),
            this.limiter.connect(this.output),
            this.meter = t.createGain(),
            this.fftMeter = t.createGain(),
            this.output.connect(this.meter),
            this.output.connect(this.fftMeter),
            this.output.connect(this.audiocontext.destination),
            this.soundArray = [],
            this.parts = [],
            this.extensions = []
        }
          , e = new t;
        return p5.prototype.getMasterVolume = function() {
            return e.output.gain.value
        }
        ,
        p5.prototype.masterVolume = function(t, r, n) {
            if ("number" == typeof t) {
                var r = r || 0
                  , n = n || 0
                  , i = e.audiocontext.currentTime
                  , o = e.output.gain.value;
                e.output.gain.cancelScheduledValues(i + n),
                e.output.gain.linearRampToValueAtTime(o, i + n),
                e.output.gain.linearRampToValueAtTime(t, i + n + r)
            } else {
                if (!t)
                    return e.output.gain;
                t.connect(e.output.gain)
            }
        }
        ,
        p5.soundOut = e,
        p5.soundOut._silentNode = e.audiocontext.createGain(),
        p5.soundOut._silentNode.gain.value = 0,
        p5.soundOut._silentNode.connect(e.audiocontext.destination),
        e
    }(sndcore);
    var helpers;
    helpers = function() {
        "use strict";
        var t = master;
        p5.prototype.sampleRate = function() {
            return t.audiocontext.sampleRate
        }
        ,
        p5.prototype.freqToMidi = function(t) {
            var e = Math.log(t / 440) / Math.log(2)
              , r = Math.round(12 * e) + 57;
            return r
        }
        ,
        p5.prototype.midiToFreq = function(t) {
            return 440 * Math.pow(2, (t - 69) / 12)
        }
        ,
        p5.prototype.soundFormats = function() {
            t.extensions = [];
            for (var e = 0; e < arguments.length; e++) {
                if (arguments[e] = arguments[e].toLowerCase(),
                !(["mp3", "wav", "ogg", "m4a", "aac"].indexOf(arguments[e]) > -1))
                    throw arguments[e] + " is not a valid sound format!";
                t.extensions.push(arguments[e])
            }
        }
        ,
        p5.prototype.disposeSound = function() {
            for (var e = 0; e < t.soundArray.length; e++)
                t.soundArray[e].dispose()
        }
        ,
        p5.prototype.registerMethod("remove", p5.prototype.disposeSound),
        p5.prototype._checkFileFormats = function(e) {
            var r;
            if ("string" == typeof e) {
                r = e;
                var n = r.split(".").pop();
                if (["mp3", "wav", "ogg", "m4a", "aac"].indexOf(n) > -1) {
                    var i = p5.prototype.isFileSupported(n);
                    if (i)
                        r = r;
                    else
                        for (var o = r.split("."), s = o[o.length - 1], a = 0; a < t.extensions.length; a++) {
                            var h = t.extensions[a]
                              , i = p5.prototype.isFileSupported(h);
                            if (i) {
                                s = "",
                                2 === o.length && (s += o[0]);
                                for (var a = 1; a <= o.length - 2; a++) {
                                    var u = o[a];
                                    s += "." + u
                                }
                                r = s += ".",
                                r = r += h;
                                break
                            }
                        }
                } else
                    for (var a = 0; a < t.extensions.length; a++) {
                        var h = t.extensions[a]
                          , i = p5.prototype.isFileSupported(h);
                        if (i) {
                            r = r + "." + h;
                            break
                        }
                    }
            } else if ("object" == typeof e)
                for (var a = 0; a < e.length; a++) {
                    var h = e[a].split(".").pop()
                      , i = p5.prototype.isFileSupported(h);
                    if (i) {
                        r = e[a];
                        break
                    }
                }
            return r
        }
        ,
        p5.prototype._mathChain = function(t, e, r, n, i) {
            for (var o in t.mathOps)
                t.mathOps[o]instanceof i && (t.mathOps[o].dispose(),
                r = o,
                r < t.mathOps.length - 1 && (n = t.mathOps[o + 1]));
            return t.mathOps[r - 1].disconnect(),
            t.mathOps[r - 1].connect(e),
            e.connect(n),
            t.mathOps[r] = e,
            t
        }
    }(master);
    var errorHandler;
    errorHandler = function() {
        "use strict";
        var t = function(t, e, r) {
            var n, i, o = new Error;
            o.name = t,
            o.originalStack = o.stack + e,
            n = o.stack + e,
            o.failedPath = r;
            var i = n.split("\n");
            return i = i.filter(function(t) {
                return !t.match(/(p5.|native code|globalInit)/g)
            }),
            o.stack = i.join("\n"),
            o
        };
        return t
    }();
    var panner;
    panner = function() {
        "use strict";
        var t = master
          , e = t.audiocontext;
        "undefined" != typeof e.createStereoPanner ? (p5.Panner = function(t, r, n) {
            this.stereoPanner = this.input = e.createStereoPanner(),
            t.connect(this.stereoPanner),
            this.stereoPanner.connect(r)
        }
        ,
        p5.Panner.prototype.pan = function(t, r) {
            var n = r || 0
              , i = e.currentTime + n;
            this.stereoPanner.pan.linearRampToValueAtTime(t, i)
        }
        ,
        p5.Panner.prototype.inputChannels = function(t) {}
        ,
        p5.Panner.prototype.connect = function(t) {
            this.stereoPanner.connect(t)
        }
        ,
        p5.Panner.prototype.disconnect = function(t) {
            this.stereoPanner.disconnect()
        }
        ) : (p5.Panner = function(t, r, n) {
            this.input = e.createGain(),
            t.connect(this.input),
            this.left = e.createGain(),
            this.right = e.createGain(),
            this.left.channelInterpretation = "discrete",
            this.right.channelInterpretation = "discrete",
            n > 1 ? (this.splitter = e.createChannelSplitter(2),
            this.input.connect(this.splitter),
            this.splitter.connect(this.left, 1),
            this.splitter.connect(this.right, 0)) : (this.input.connect(this.left),
            this.input.connect(this.right)),
            this.output = e.createChannelMerger(2),
            this.left.connect(this.output, 0, 1),
            this.right.connect(this.output, 0, 0),
            this.output.connect(r)
        }
        ,
        p5.Panner.prototype.pan = function(t, r) {
            var n = r || 0
              , i = e.currentTime + n
              , o = (t + 1) / 2
              , s = Math.cos(o * Math.PI / 2)
              , a = Math.sin(o * Math.PI / 2);
            this.left.gain.linearRampToValueAtTime(a, i),
            this.right.gain.linearRampToValueAtTime(s, i)
        }
        ,
        p5.Panner.prototype.inputChannels = function(t) {
            1 === t ? (this.input.disconnect(),
            this.input.connect(this.left),
            this.input.connect(this.right)) : 2 === t && (this.splitter = e.createChannelSplitter(2),
            this.input.disconnect(),
            this.input.connect(this.splitter),
            this.splitter.connect(this.left, 1),
            this.splitter.connect(this.right, 0))
        }
        ,
        p5.Panner.prototype.connect = function(t) {
            this.output.connect(t)
        }
        ,
        p5.Panner.prototype.disconnect = function(t) {
            this.output.disconnect()
        }
        ),
        p5.Panner3D = function(t, r) {
            var n = e.createPanner();
            return n.panningModel = "HRTF",
            n.distanceModel = "linear",
            n.setPosition(0, 0, 0),
            t.connect(n),
            n.connect(r),
            n.pan = function(t, e, r) {
                n.setPosition(t, e, r)
            }
            ,
            n
        }
    }(master);
    var soundfile;
    soundfile = function() {
        "use strict";
        function t(t, e) {
            for (var r = {}, n = t.length, i = 0; n > i; i++) {
                if (t[i] > e) {
                    var o = t[i]
                      , s = new u(o,i);
                    r[i] = s,
                    i += 6e3
                }
                i++
            }
            return r
        }
        function e(t) {
            for (var e = [], r = Object.keys(t).sort(), n = 0; n < r.length; n++)
                for (var i = 0; 10 > i; i++) {
                    var o = t[r[n]]
                      , s = t[r[n + i]];
                    if (o && s) {
                        var a = o.sampleIndex
                          , h = s.sampleIndex
                          , u = h - a;
                        u > 0 && o.intervals.push(u);
                        var l = e.some(function(t, e) {
                            return t.interval === u ? (t.count++,
                            t) : void 0
                        });
                        l || e.push({
                            interval: u,
                            count: 1
                        })
                    }
                }
            return e
        }
        function r(t, e) {
            var r = [];
            return t.forEach(function(t, n) {
                try {
                    var o = Math.abs(60 / (t.interval / e));
                    o = i(o);
                    var s = r.some(function(e) {
                        return e.tempo === o ? e.count += t.count : void 0
                    });
                    if (!s) {
                        if (isNaN(o))
                            return;
                        r.push({
                            tempo: Math.round(o),
                            count: t.count
                        })
                    }
                } catch (a) {
                    throw a
                }
            }),
            r
        }
        function n(t, e, r, n) {
            for (var o = [], s = Object.keys(t).sort(), a = 0; a < s.length; a++)
                for (var h = s[a], u = t[h], l = 0; l < u.intervals.length; l++) {
                    var p = Math.round(Math.abs(60 / (u.intervals[l] / r)));
                    p = i(p),
                    Math.abs(p - e) < n && o.push(u.sampleIndex / 44100)
                }
            return o = o.filter(function(t, e, r) {
                var n = r[e + 1] - t;
                return n > .01 ? !0 : void 0
            })
        }
        function i(t) {
            if (isFinite(t) && 0 != t) {
                for (; 90 > t; )
                    t *= 2;
                for (; t > 180 && t > 90; )
                    t /= 2;
                return t
            }
        }
        var o = errorHandler
          , s = master
          , a = s.audiocontext;
        p5.SoundFile = function(t, e, r, n) {
            if ("undefined" != typeof t) {
                if ("string" == typeof t || "string" == typeof t[0]) {
                    var i = p5.prototype._checkFileFormats(t);
                    this.url = i
                } else if ("object" == typeof t && !(window.File && window.FileReader && window.FileList && window.Blob))
                    throw "Unable to load file because the File API is not supported";
                t.file && (t = t.file),
                this.file = t
            }
            this._onended = function() {}
            ,
            this._looping = !1,
            this._playing = !1,
            this._paused = !1,
            this._pauseTime = 0,
            this._cues = [],
            this._lastPos = 0,
            this._counterNode,
            this._scopeNode,
            this.bufferSourceNodes = [],
            this.bufferSourceNode = null,
            this.buffer = null,
            this.playbackRate = 1,
            this.gain = 1,
            this.input = s.audiocontext.createGain(),
            this.output = s.audiocontext.createGain(),
            this.reversed = !1,
            this.startTime = 0,
            this.endTime = null,
            this.pauseTime = 0,
            this.mode = "sustain",
            this.startMillis = null,
            this.panPosition = 0,
            this.panner = new p5.Panner(this.output,s.input,2),
            (this.url || this.file) && this.load(e, r),
            s.soundArray.push(this),
            "function" == typeof n ? this._whileLoading = n : this._whileLoading = function() {}
        }
        ,
        p5.prototype.registerPreloadMethod("loadSound", p5.prototype),
        p5.prototype.loadSound = function(t, e, r, n) {
            window.location.origin.indexOf("file://") > -1 && "undefined" === window.cordova && alert("This sketch may require a server to load external files. Please see http://bit.ly/1qcInwS");
            var i = new p5.SoundFile(t,e,r,n);
            return i
        }
        ,
        p5.SoundFile.prototype.load = function(t, e) {
            var r = this
              , n = (new Error).stack;
            if (void 0 != this.url && "" != this.url) {
                var i = new XMLHttpRequest;
                i.addEventListener("progress", function(t) {
                    r._updateProgress(t)
                }, !1),
                i.open("GET", this.url, !0),
                i.responseType = "arraybuffer",
                i.onload = function() {
                    if (200 == i.status)
                        a.decodeAudioData(i.response, function(e) {
                            r.buffer = e,
                            r.panner.inputChannels(e.numberOfChannels),
                            t && t(r)
                        }, function(t) {
                            var i = new o("decodeAudioData",n,r.url)
                              , s = "AudioContext error at decodeAudioData for " + r.url;
                            e ? (i.msg = s,
                            e(i)) : console.error(s + "\n The error stack trace includes: \n" + i.stack)
                        });
                    else {
                        var s = new o("loadSound",n,r.url)
                          , h = "Unable to load " + r.url + ". The request status was: " + i.status + " (" + i.statusText + ")";
                        e ? (s.message = h,
                        e(s)) : console.error(h + "\n The error stack trace includes: \n" + s.stack)
                    }
                }
                ,
                i.onerror = function(t) {
                    var i = new o("loadSound",n,r.url)
                      , s = "There was no response from the server at " + r.url + ". Check the url and internet connectivity.";
                    e ? (i.message = s,
                    e(i)) : console.error(s + "\n The error stack trace includes: \n" + i.stack)
                }
                ,
                i.send()
            } else if (void 0 != this.file) {
                var s = new FileReader
                  , r = this;
                s.onload = function() {
                    a.decodeAudioData(s.result, function(e) {
                        r.buffer = e,
                        r.panner.inputChannels(e.numberOfChannels),
                        t && t(r)
                    })
                }
                ,
                s.onerror = function(t) {
                    onerror && onerror(t)
                }
                ,
                s.readAsArrayBuffer(this.file)
            }
        }
        ,
        p5.SoundFile.prototype._updateProgress = function(t) {
            if (t.lengthComputable) {
                var e = Math.log(t.loaded / t.total * 9.9);
                this._whileLoading(e)
            } else
                this._whileLoading("size unknown")
        }
        ,
        p5.SoundFile.prototype.isLoaded = function() {
            return !!this.buffer
        }
        ,
        p5.SoundFile.prototype.play = function(t, e, r, n, i) {
            var o, a, h = this, u = s.audiocontext.currentTime, t = t || 0;
            if (0 > t && (t = 0),
            t += u,
            !this.buffer)
                throw "not ready to play file, buffer has yet to load. Try preload()";
            if (this._pauseTime = 0,
            "restart" === this.mode && this.buffer && this.bufferSourceNode) {
                var u = s.audiocontext.currentTime;
                this.bufferSourceNode.stop(t),
                this._counterNode.stop(t)
            }
            if (this.bufferSourceNode = this._initSourceNode(),
            this._counterNode && (this._counterNode = void 0),
            this._counterNode = this._initCounterNode(),
            n) {
                if (!(n >= 0 && n < this.buffer.duration))
                    throw "start time out of range";
                o = n
            } else
                o = 0;
            i = i ? i <= this.buffer.duration - o ? i : this.buffer.duration : this.buffer.duration - o;
            var l = r || 1;
            this.bufferSourceNode.connect(this.output),
            this.output.gain.value = l,
            e = e || Math.abs(this.playbackRate),
            this.bufferSourceNode.playbackRate.setValueAtTime(e, u),
            this._paused ? (this.bufferSourceNode.start(t, this.pauseTime, i),
            this._counterNode.start(t, this.pauseTime, i)) : (this.bufferSourceNode.start(t, o, i),
            this._counterNode.start(t, o, i)),
            this._playing = !0,
            this._paused = !1,
            this.bufferSourceNodes.push(this.bufferSourceNode),
            this.bufferSourceNode._arrayIndex = this.bufferSourceNodes.length - 1;
            var p = function(t) {
                this._playing = !1,
                this.removeEventListener("ended", p, !1),
                h._onended(h),
                h.bufferSourceNodes.forEach(function(t, e) {
                    t._playing === !1 && h.bufferSourceNodes.splice(e)
                }),
                0 === h.bufferSourceNodes.length && (h._playing = !1)
            };
            if (this.bufferSourceNode.onended = p,
            this.bufferSourceNode.loop = this._looping,
            this._counterNode.loop = this._looping,
            this._looping === !0) {
                var a = o + i;
                this.bufferSourceNode.loopStart = o,
                this.bufferSourceNode.loopEnd = a,
                this._counterNode.loopStart = o,
                this._counterNode.loopEnd = a
            }
        }
        ,
        p5.SoundFile.prototype.playMode = function(t) {
            var e = t.toLowerCase();
            if ("restart" === e && this.buffer && this.bufferSourceNode)
                for (var r = 0; r < this.bufferSourceNodes.length - 1; r++) {
                    var n = s.audiocontext.currentTime;
                    this.bufferSourceNodes[r].stop(n)
                }
            if ("restart" !== e && "sustain" !== e)
                throw 'Invalid play mode. Must be either "restart" or "sustain"';
            this.mode = e
        }
        ,
        p5.SoundFile.prototype.pause = function(t) {
            var e = s.audiocontext.currentTime
              , t = t || 0
              , r = t + e;
            this.isPlaying() && this.buffer && this.bufferSourceNode ? (this.pauseTime = this.currentTime(),
            this.bufferSourceNode.stop(r),
            this._counterNode.stop(r),
            this._paused = !0,
            this._playing = !1,
            this._pauseTime = this.currentTime()) : this._pauseTime = 0
        }
        ,
        p5.SoundFile.prototype.loop = function(t, e, r, n, i) {
            this._looping = !0,
            this.play(t, e, r, n, i)
        }
        ,
        p5.SoundFile.prototype.setLoop = function(t) {
            if (t === !0)
                this._looping = !0;
            else {
                if (t !== !1)
                    throw "Error: setLoop accepts either true or false";
                this._looping = !1
            }
            this.bufferSourceNode && (this.bufferSourceNode.loop = this._looping,
            this._counterNode.loop = this._looping)
        }
        ,
        p5.SoundFile.prototype.isLooping = function() {
            return !(!this.bufferSourceNode || this._looping !== !0 || this.isPlaying() !== !0)
        }
        ,
        p5.SoundFile.prototype.isPlaying = function() {
            return this._playing
        }
        ,
        p5.SoundFile.prototype.isPaused = function() {
            return this._paused
        }
        ,
        p5.SoundFile.prototype.stop = function(t) {
            var e = t || 0;
            if ("sustain" == this.mode)
                this.stopAll(e),
                this._playing = !1,
                this.pauseTime = 0,
                this._paused = !1;
            else if (this.buffer && this.bufferSourceNode) {
                var r = s.audiocontext.currentTime
                  , n = e || 0;
                this.pauseTime = 0,
                this.bufferSourceNode.stop(r + n),
                this._counterNode.stop(r + n),
                this._playing = !1,
                this._paused = !1
            }
        }
        ,
        p5.SoundFile.prototype.stopAll = function(t) {
            var e = s.audiocontext.currentTime
              , r = t || 0;
            if (this.buffer && this.bufferSourceNode) {
                for (var n = 0; n < this.bufferSourceNodes.length; n++)
                    if (void 0 != typeof this.bufferSourceNodes[n])
                        try {
                            this.bufferSourceNodes[n].onended = function() {}
                            ,
                            this.bufferSourceNodes[n].stop(e + r)
                        } catch (i) {}
                this._counterNode.stop(e + r),
                this._onended(this)
            }
        }
        ,
        p5.SoundFile.prototype.setVolume = function(t, e, r) {
            if ("number" == typeof t) {
                var e = e || 0
                  , r = r || 0
                  , n = s.audiocontext.currentTime
                  , i = this.output.gain.value;
                this.output.gain.cancelScheduledValues(n + r),
                this.output.gain.linearRampToValueAtTime(i, n + r),
                this.output.gain.linearRampToValueAtTime(t, n + r + e)
            } else {
                if (!t)
                    return this.output.gain;
                t.connect(this.output.gain)
            }
        }
        ,
        p5.SoundFile.prototype.amp = p5.SoundFile.prototype.setVolume,
        p5.SoundFile.prototype.fade = p5.SoundFile.prototype.setVolume,
        p5.SoundFile.prototype.getVolume = function() {
            return this.output.gain.value
        }
        ,
        p5.SoundFile.prototype.pan = function(t, e) {
            this.panPosition = t,
            this.panner.pan(t, e)
        }
        ,
        p5.SoundFile.prototype.getPan = function() {
            return this.panPosition
        }
        ,
        p5.SoundFile.prototype.rate = function(t) {
            if (this.playbackRate !== t || !this.bufferSourceNode || this.bufferSourceNode.playbackRate.value !== t) {
                this.playbackRate = t;
                var e = t;
                if (0 === this.playbackRate && this._playing && this.pause(),
                this.playbackRate < 0 && !this.reversed) {
                    var r = this.currentTime();
                    this.bufferSourceNode.playbackRate.value,
                    this.reverseBuffer(),
                    e = Math.abs(t);
                    var n = (r - this.duration()) / e;
                    this.pauseTime = n
                } else
                    this.playbackRate > 0 && this.reversed && this.reverseBuffer();
                if (this.bufferSourceNode) {
                    var i = s.audiocontext.currentTime;
                    this.bufferSourceNode.playbackRate.cancelScheduledValues(i),
                    this.bufferSourceNode.playbackRate.linearRampToValueAtTime(Math.abs(e), i),
                    this._counterNode.playbackRate.cancelScheduledValues(i),
                    this._counterNode.playbackRate.linearRampToValueAtTime(Math.abs(e), i)
                }
            }
        }
        ,
        p5.SoundFile.prototype.setPitch = function(t) {
            var e = midiToFreq(t) / midiToFreq(60);
            this.rate(e)
        }
        ,
        p5.SoundFile.prototype.getPlaybackRate = function() {
            return this.playbackRate
        }
        ,
        p5.SoundFile.prototype.duration = function() {
            return this.buffer ? this.buffer.duration : 0
        }
        ,
        p5.SoundFile.prototype.currentTime = function() {
            return this._pauseTime > 0 ? this._pauseTime : this._lastPos / a.sampleRate
        }
        ,
        p5.SoundFile.prototype.jump = function(t, e) {
            if (0 > t || t > this.buffer.duration)
                throw "jump time out of range";
            if (e > this.buffer.duration - t)
                throw "end time out of range";
            var r = t || 0
              , n = e || this.buffer.duration - t;
            this.isPlaying() && this.stop(),
            this.play(0, this.playbackRate, this.output.gain.value, r, n)
        }
        ,
        p5.SoundFile.prototype.channels = function() {
            return this.buffer.numberOfChannels
        }
        ,
        p5.SoundFile.prototype.sampleRate = function() {
            return this.buffer.sampleRate
        }
        ,
        p5.SoundFile.prototype.frames = function() {
            return this.buffer.length
        }
        ,
        p5.SoundFile.prototype.getPeaks = function(t) {
            if (!this.buffer)
                throw "Cannot load peaks yet, buffer is not loaded";
            if (t || (t = 5 * window.width),
            this.buffer) {
                for (var e = this.buffer, r = e.length / t, n = ~~(r / 10) || 1, i = e.numberOfChannels, o = new Float32Array(Math.round(t)), s = 0; i > s; s++)
                    for (var a = e.getChannelData(s), h = 0; t > h; h++) {
                        for (var u = ~~(h * r), l = ~~(u + r), p = 0, c = u; l > c; c += n) {
                            var d = a[c];
                            d > p ? p = d : -d > p && (p = d)
                        }
                        (0 === s || Math.abs(p) > o[h]) && (o[h] = p)
                    }
                return o
            }
        }
        ,
        p5.SoundFile.prototype.reverseBuffer = function() {
            var t = this.getVolume();
            if (this.setVolume(0, .01, 0),
            this.pause(),
            !this.buffer)
                throw "SoundFile is not done loading";
            for (var e = 0; e < this.buffer.numberOfChannels; e++)
                Array.prototype.reverse.call(this.buffer.getChannelData(e));
            this.reversed = !this.reversed,
            this.setVolume(t, .01, .0101),
            this.play()
        }
        ,
        p5.SoundFile.prototype.onended = function(t) {
            return this._onended = t,
            this
        }
        ,
        p5.SoundFile.prototype.add = function() {}
        ,
        p5.SoundFile.prototype.dispose = function() {
            var t = s.audiocontext.currentTime
              , e = s.soundArray.indexOf(this);
            if (s.soundArray.splice(e, 1),
            this.stop(t),
            this.buffer && this.bufferSourceNode) {
                for (var r = 0; r < this.bufferSourceNodes.length - 1; r++)
                    if (null !== this.bufferSourceNodes[r]) {
                        this.bufferSourceNodes[r].disconnect();
                        try {
                            this.bufferSourceNodes[r].stop(t)
                        } catch (n) {}
                        this.bufferSourceNodes[r] = null
                    }
                if (this.isPlaying()) {
                    try {
                        this._counterNode.stop(t)
                    } catch (n) {
                        console.log(n)
                    }
                    this._counterNode = null
                }
            }
            this.output && (this.output.disconnect(),
            this.output = null),
            this.panner && (this.panner.disconnect(),
            this.panner = null)
        }
        ,
        p5.SoundFile.prototype.connect = function(t) {
            t ? t.hasOwnProperty("input") ? this.panner.connect(t.input) : this.panner.connect(t) : this.panner.connect(s.input)
        }
        ,
        p5.SoundFile.prototype.disconnect = function(t) {
            this.panner.disconnect(t)
        }
        ,
        p5.SoundFile.prototype.getLevel = function(t) {
            console.warn("p5.SoundFile.getLevel has been removed from the library. Use p5.Amplitude instead")
        }
        ,
        p5.SoundFile.prototype.setPath = function(t, e) {
            var r = p5.prototype._checkFileFormats(t);
            this.url = r,
            this.load(e)
        }
        ,
        p5.SoundFile.prototype.setBuffer = function(t) {
            var e = t.length
              , r = t[0].length
              , n = a.createBuffer(e, r, a.sampleRate);
            !t[0]instanceof Float32Array && (t[0] = new Float32Array(t[0]));
            for (var i = 0; e > i; i++) {
                var o = n.getChannelData(i);
                o.set(t[i])
            }
            this.buffer = n,
            this.panner.inputChannels(e)
        }
        ,
        p5.SoundFile.prototype._initCounterNode = function() {
            var t = this
              , e = a.currentTime
              , r = a.createBufferSource();
            return t._scopeNode && (t._scopeNode.disconnect(),
            t._scopeNode.onaudioprocess = void 0,
            t._scopeNode = null),
            t._scopeNode = a.createScriptProcessor(256, 1, 1),
            r.buffer = h(t.buffer),
            r.playbackRate.setValueAtTime(t.playbackRate, e),
            r.connect(t._scopeNode),
            t._scopeNode.connect(p5.soundOut._silentNode),
            t._scopeNode.onaudioprocess = function(e) {
                var r = e.inputBuffer.getChannelData(0);
                t._lastPos = r[r.length - 1] || 0,
                t._onTimeUpdate(t._lastPos)
            }
            ,
            r
        }
        ,
        p5.SoundFile.prototype._initSourceNode = function() {
            var t = this
              , e = a.currentTime
              , r = a.createBufferSource();
            return r.buffer = t.buffer,
            r.playbackRate.setValueAtTime(t.playbackRate, e),
            r
        }
        ;
        var h = function(t) {
            for (var e = new Float32Array(t.length), r = a.createBuffer(1, t.length, 44100), n = 0; n < t.length; n++)
                e[n] = n;
            return r.getChannelData(0).set(e),
            r
        };
        p5.SoundFile.prototype.processPeaks = function(i, o, s, a) {
            var h = this.buffer.length
              , u = this.buffer.sampleRate
              , p = this.buffer
              , c = o || .9
              , d = c
              , f = s || .22
              , m = a || 200
              , y = new OfflineAudioContext(1,h,u)
              , g = y.createBufferSource();
            g.buffer = p;
            var v = y.createBiquadFilter();
            v.type = "lowpass",
            g.connect(v),
            v.connect(y.destination),
            g.start(0),
            y.startRendering(),
            y.oncomplete = function(o) {
                var s = o.renderedBuffer
                  , a = s.getChannelData(0);
                do
                    l = t(a, d),
                    d -= .005;
                while (Object.keys(l).length < m && d >= f);
                var h = e(l)
                  , u = r(h, s.sampleRate)
                  , p = u.sort(function(t, e) {
                    return e.count - t.count
                }).splice(0, 5);
                this.tempo = p[0].tempo;
                var c = 5
                  , y = n(l, p[0].tempo, s.sampleRate, c);
                i(y)
            }
        }
        ;
        var u = function(t, e) {
            this.sampleIndex = e,
            this.amplitude = t,
            this.tempos = [],
            this.intervals = []
        }
          , l = [];
        p5.SoundFile.prototype.addCue = function(t, e, r) {
            var n = this._cueIDCounter++
              , i = new p(e,t,n,r);
            return this._cues.push(i),
            n
        }
        ,
        p5.SoundFile.prototype.removeCue = function(t) {
            for (var e = this._cues.length, r = 0; e > r; r++) {
                var n = this._cues[r];
                n.id === t && this.cues.splice(r, 1)
            }
            0 === this._cues.length
        }
        ,
        p5.SoundFile.prototype.clearCues = function() {
            this._cues = []
        }
        ,
        p5.SoundFile.prototype._onTimeUpdate = function(t) {
            for (var e = t / this.buffer.sampleRate, r = this._cues.length, n = 0; r > n; n++) {
                var i = this._cues[n]
                  , o = i.time
                  , s = i.val;
                this._prevTime < o && e >= o && i.callback(s)
            }
            this._prevTime = e
        }
        ;
        var p = function(t, e, r, n) {
            this.callback = t,
            this.time = e,
            this.id = r,
            this.val = n
        }
    }(sndcore, errorHandler, master);
    var amplitude;
    amplitude = function() {
        "use strict";
        var t = master;
        p5.Amplitude = function(e) {
            this.bufferSize = 2048,
            this.audiocontext = t.audiocontext,
            this.processor = this.audiocontext.createScriptProcessor(this.bufferSize, 2, 1),
            this.input = this.processor,
            this.output = this.audiocontext.createGain(),
            this.smoothing = e || 0,
            this.volume = 0,
            this.average = 0,
            this.stereoVol = [0, 0],
            this.stereoAvg = [0, 0],
            this.stereoVolNorm = [0, 0],
            this.volMax = .001,
            this.normalize = !1,
            this.processor.onaudioprocess = this._audioProcess.bind(this),
            this.processor.connect(this.output),
            this.output.gain.value = 0,
            this.output.connect(this.audiocontext.destination),
            t.meter.connect(this.processor),
            t.soundArray.push(this)
        }
        ,
        p5.Amplitude.prototype.setInput = function(e, r) {
            t.meter.disconnect(),
            r && (this.smoothing = r),
            null == e ? (console.log("Amplitude input source is not ready! Connecting to master output instead"),
            t.meter.connect(this.processor)) : e instanceof p5.Signal ? e.output.connect(this.processor) : e ? (e.connect(this.processor),
            this.processor.disconnect(),
            this.processor.connect(this.output)) : t.meter.connect(this.processor)
        }
        ,
        p5.Amplitude.prototype.connect = function(e) {
            e ? e.hasOwnProperty("input") ? this.output.connect(e.input) : this.output.connect(e) : this.output.connect(this.panner.connect(t.input))
        }
        ,
        p5.Amplitude.prototype.disconnect = function(t) {
            this.output.disconnect()
        }
        ,
        p5.Amplitude.prototype._audioProcess = function(t) {
            for (var e = 0; e < t.inputBuffer.numberOfChannels; e++) {
                for (var r, n = t.inputBuffer.getChannelData(e), i = n.length, o = 0, s = 0, a = 0; i > a; a++)
                    r = n[a],
                    this.normalize ? (o += Math.max(Math.min(r / this.volMax, 1), -1),
                    s += Math.max(Math.min(r / this.volMax, 1), -1) * Math.max(Math.min(r / this.volMax, 1), -1)) : (o += r,
                    s += r * r);
                var h = o / i
                  , u = Math.sqrt(s / i);
                this.stereoVol[e] = Math.max(u, this.stereoVol[e] * this.smoothing),
                this.stereoAvg[e] = Math.max(h, this.stereoVol[e] * this.smoothing),
                this.volMax = Math.max(this.stereoVol[e], this.volMax)
            }
            var l = this
              , p = this.stereoVol.reduce(function(t, e, r) {
                return l.stereoVolNorm[r - 1] = Math.max(Math.min(l.stereoVol[r - 1] / l.volMax, 1), 0),
                l.stereoVolNorm[r] = Math.max(Math.min(l.stereoVol[r] / l.volMax, 1), 0),
                t + e
            });
            this.volume = p / this.stereoVol.length,
            this.volNorm = Math.max(Math.min(this.volume / this.volMax, 1), 0)
        }
        ,
        p5.Amplitude.prototype.getLevel = function(t) {
            return "undefined" != typeof t ? this.normalize ? this.stereoVolNorm[t] : this.stereoVol[t] : this.normalize ? this.volNorm : this.volume
        }
        ,
        p5.Amplitude.prototype.toggleNormalize = function(t) {
            "boolean" == typeof t ? this.normalize = t : this.normalize = !this.normalize
        }
        ,
        p5.Amplitude.prototype.smooth = function(t) {
            t >= 0 && 1 > t ? this.smoothing = t : console.log("Error: smoothing must be between 0 and 1")
        }
        ,
        p5.Amplitude.prototype.dispose = function() {
            var e = t.soundArray.indexOf(this);
            t.soundArray.splice(e, 1),
            this.input.disconnect(),
            this.output.disconnect(),
            this.input = this.processor = void 0,
            this.output = void 0
        }
    }(master);
    var fft;
    fft = function() {
        "use strict";
        var t = master;
        p5.FFT = function(e, r) {
            this.smoothing = e || .8,
            this.bins = r || 1024;
            var n = 2 * r || 2048;
            this.input = this.analyser = t.audiocontext.createAnalyser(),
            t.fftMeter.connect(this.analyser),
            this.analyser.smoothingTimeConstant = this.smoothing,
            this.analyser.fftSize = n,
            this.freqDomain = new Uint8Array(this.analyser.frequencyBinCount),
            this.timeDomain = new Uint8Array(this.analyser.frequencyBinCount),
            this.bass = [20, 140],
            this.lowMid = [140, 400],
            this.mid = [400, 2600],
            this.highMid = [2600, 5200],
            this.treble = [5200, 14e3],
            t.soundArray.push(this)
        }
        ,
        p5.FFT.prototype.setInput = function(e) {
            e ? (e.output ? e.output.connect(this.analyser) : e.connect && e.connect(this.analyser),
            t.fftMeter.disconnect()) : t.fftMeter.connect(this.analyser)
        }
        ,
        p5.FFT.prototype.waveform = function() {
            for (var t, e, r, o = 0; o < arguments.length; o++)
                "number" == typeof arguments[o] && (t = arguments[o],
                this.analyser.fftSize = 2 * t),
                "string" == typeof arguments[o] && (e = arguments[o]);
            if (e && !p5.prototype._isSafari())
                return n(this, this.timeDomain),
                this.analyser.getFloatTimeDomainData(this.timeDomain),
                this.timeDomain;
            i(this, this.timeDomain),
            this.analyser.getByteTimeDomainData(this.timeDomain);
            for (var r = new Array, o = 0; o < this.timeDomain.length; o++) {
                var s = p5.prototype.map(this.timeDomain[o], 0, 255, -1, 1);
                r.push(s)
            }
            return r
        }
        ,
        p5.FFT.prototype.analyze = function() {
            for (var t, n, i = 0; i < arguments.length; i++)
                "number" == typeof arguments[i] && (t = this.bins = arguments[i],
                this.analyser.fftSize = 2 * this.bins),
                "string" == typeof arguments[i] && (n = arguments[i]);
            if (n && "db" === n.toLowerCase())
                return e(this),
                this.analyser.getFloatFrequencyData(this.freqDomain),
                this.freqDomain;
            r(this, this.freqDomain),
            this.analyser.getByteFrequencyData(this.freqDomain);
            var o = Array.apply([], this.freqDomain);
            return o.length === this.analyser.fftSize,
            o.constructor === Array,
            o
        }
        ,
        p5.FFT.prototype.getEnergy = function(e, r) {
            var n = t.audiocontext.sampleRate / 2;
            if ("bass" === e ? (e = this.bass[0],
            r = this.bass[1]) : "lowMid" === e ? (e = this.lowMid[0],
            r = this.lowMid[1]) : "mid" === e ? (e = this.mid[0],
            r = this.mid[1]) : "highMid" === e ? (e = this.highMid[0],
            r = this.highMid[1]) : "treble" === e && (e = this.treble[0],
            r = this.treble[1]),
            "number" != typeof e)
                throw "invalid input for getEnergy()";
            if (r) {
                if (e && r) {
                    if (e > r) {
                        var i = r;
                        r = e,
                        e = i
                    }
                    for (var o = Math.round(e / n * this.freqDomain.length), s = Math.round(r / n * this.freqDomain.length), a = 0, h = 0, u = o; s >= u; u++)
                        a += this.freqDomain[u],
                        h += 1;
                    var l = a / h;
                    return l
                }
                throw "invalid input for getEnergy()"
            }
            var p = Math.round(e / n * this.freqDomain.length);
            return this.freqDomain[p]
        }
        ,
        p5.FFT.prototype.getFreq = function(t, e) {
            console.log("getFreq() is deprecated. Please use getEnergy() instead.");
            var r = this.getEnergy(t, e);
            return r
        }
        ,
        p5.FFT.prototype.getCentroid = function() {
            for (var e = t.audiocontext.sampleRate / 2, r = 0, n = 0, i = 0; i < this.freqDomain.length; i++)
                r += i * this.freqDomain[i],
                n += this.freqDomain[i];
            var o = 0;
            0 != n && (o = r / n);
            var s = o * (e / this.freqDomain.length);
            return s
        }
        ,
        p5.FFT.prototype.smooth = function(t) {
            t && (this.smoothing = t),
            this.analyser.smoothingTimeConstant = t
        }
        ,
        p5.FFT.prototype.dispose = function() {
            var e = t.soundArray.indexOf(this);
            t.soundArray.splice(e, 1),
            this.analyser.disconnect(),
            this.analyser = void 0
        }
        ;
        var e = function(t) {
            t.freqDomain instanceof Float32Array == 0 && (t.freqDomain = new Float32Array(t.analyser.frequencyBinCount))
        }
          , r = function(t) {
            t.freqDomain instanceof Uint8Array == 0 && (t.freqDomain = new Uint8Array(t.analyser.frequencyBinCount))
        }
          , n = function(t) {
            t.timeDomain instanceof Float32Array == 0 && (t.timeDomain = new Float32Array(t.analyser.frequencyBinCount))
        }
          , i = function(t) {
            t.timeDomain instanceof Uint8Array == 0 && (t.timeDomain = new Uint8Array(t.analyser.frequencyBinCount))
        }
    }(master);
    var Tone_core_Tone;
    Tone_core_Tone = function() {
        "use strict";
        function t(t) {
            return void 0 === t
        }
        function e(t) {
            return "function" == typeof t
        }
        var r;
        if (t(window.AudioContext) && (window.AudioContext = window.webkitAudioContext),
        t(window.OfflineAudioContext) && (window.OfflineAudioContext = window.webkitOfflineAudioContext),
        t(AudioContext))
            throw new Error("Web Audio is not supported in this browser");
        r = new AudioContext,
        e(AudioContext.prototype.createGain) || (AudioContext.prototype.createGain = AudioContext.prototype.createGainNode),
        e(AudioContext.prototype.createDelay) || (AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode),
        e(AudioContext.prototype.createPeriodicWave) || (AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable),
        e(AudioBufferSourceNode.prototype.start) || (AudioBufferSourceNode.prototype.start = AudioBufferSourceNode.prototype.noteGrainOn),
        e(AudioBufferSourceNode.prototype.stop) || (AudioBufferSourceNode.prototype.stop = AudioBufferSourceNode.prototype.noteOff),
        e(OscillatorNode.prototype.start) || (OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn),
        e(OscillatorNode.prototype.stop) || (OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff),
        e(OscillatorNode.prototype.setPeriodicWave) || (OscillatorNode.prototype.setPeriodicWave = OscillatorNode.prototype.setWaveTable),
        AudioNode.prototype._nativeConnect = AudioNode.prototype.connect,
        AudioNode.prototype.connect = function(e, r, n) {
            if (e.input)
                Array.isArray(e.input) ? (t(n) && (n = 0),
                this.connect(e.input[n])) : this.connect(e.input, r, n);
            else
                try {
                    e instanceof AudioNode ? this._nativeConnect(e, r, n) : this._nativeConnect(e, r)
                } catch (i) {
                    throw new Error("error connecting to node: " + e)
                }
        }
        ;
        var n = function(e, r) {
            t(e) || 1 === e ? this.input = this.context.createGain() : e > 1 && (this.input = new Array(e)),
            t(r) || 1 === r ? this.output = this.context.createGain() : r > 1 && (this.output = new Array(e))
        };
        n.prototype.set = function(e, r, i) {
            if (this.isObject(e))
                i = r;
            else if (this.isString(e)) {
                var o = {};
                o[e] = r,
                e = o
            }
            for (var s in e) {
                r = e[s];
                var a = this;
                if (-1 !== s.indexOf(".")) {
                    for (var h = s.split("."), u = 0; u < h.length - 1; u++)
                        a = a[h[u]];
                    s = h[h.length - 1]
                }
                var l = a[s];
                t(l) || (n.Signal && l instanceof n.Signal || n.Param && l instanceof n.Param ? l.value !== r && (t(i) ? l.value = r : l.rampTo(r, i)) : l instanceof AudioParam ? l.value !== r && (l.value = r) : l instanceof n ? l.set(r) : l !== r && (a[s] = r))
            }
            return this
        }
        ,
        n.prototype.get = function(r) {
            t(r) ? r = this._collectDefaults(this.constructor) : this.isString(r) && (r = [r]);
            for (var i = {}, o = 0; o < r.length; o++) {
                var s = r[o]
                  , a = this
                  , h = i;
                if (-1 !== s.indexOf(".")) {
                    for (var u = s.split("."), l = 0; l < u.length - 1; l++) {
                        var p = u[l];
                        h[p] = h[p] || {},
                        h = h[p],
                        a = a[p]
                    }
                    s = u[u.length - 1]
                }
                var c = a[s];
                this.isObject(r[s]) ? h[s] = c.get() : n.Signal && c instanceof n.Signal ? h[s] = c.value : n.Param && c instanceof n.Param ? h[s] = c.value : c instanceof AudioParam ? h[s] = c.value : c instanceof n ? h[s] = c.get() : e(c) || t(c) || (h[s] = c)
            }
            return i
        }
        ,
        n.prototype._collectDefaults = function(e) {
            var r = [];
            if (t(e.defaults) || (r = Object.keys(e.defaults)),
            !t(e._super))
                for (var n = this._collectDefaults(e._super), i = 0; i < n.length; i++)
                    -1 === r.indexOf(n[i]) && r.push(n[i]);
            return r
        }
        ,
        n.prototype.toString = function() {
            for (var t in n) {
                var r = t[0].match(/^[A-Z]$/)
                  , i = n[t] === this.constructor;
                if (e(n[t]) && r && i)
                    return t
            }
            return "Tone"
        }
        ,
        n.context = r,
        n.prototype.context = n.context,
        n.prototype.bufferSize = 2048,
        n.prototype.blockTime = 128 / n.context.sampleRate,
        n.prototype.dispose = function() {
            return this.isUndef(this.input) || (this.input instanceof AudioNode && this.input.disconnect(),
            this.input = null),
            this.isUndef(this.output) || (this.output instanceof AudioNode && this.output.disconnect(),
            this.output = null),
            this
        }
        ;
        var i = null;
        n.prototype.noGC = function() {
            return this.output.connect(i),
            this
        }
        ,
        AudioNode.prototype.noGC = function() {
            return this.connect(i),
            this
        }
        ,
        n.prototype.connect = function(t, e, r) {
            return Array.isArray(this.output) ? (e = this.defaultArg(e, 0),
            this.output[e].connect(t, 0, r)) : this.output.connect(t, e, r),
            this
        }
        ,
        n.prototype.disconnect = function(t) {
            return Array.isArray(this.output) ? (t = this.defaultArg(t, 0),
            this.output[t].disconnect()) : this.output.disconnect(),
            this
        }
        ,
        n.prototype.connectSeries = function() {
            if (arguments.length > 1)
                for (var t = arguments[0], e = 1; e < arguments.length; e++) {
                    var r = arguments[e];
                    t.connect(r),
                    t = r
                }
            return this
        }
        ,
        n.prototype.connectParallel = function() {
            var t = arguments[0];
            if (arguments.length > 1)
                for (var e = 1; e < arguments.length; e++) {
                    var r = arguments[e];
                    t.connect(r)
                }
            return this
        }
        ,
        n.prototype.chain = function() {
            if (arguments.length > 0)
                for (var t = this, e = 0; e < arguments.length; e++) {
                    var r = arguments[e];
                    t.connect(r),
                    t = r
                }
            return this
        }
        ,
        n.prototype.fan = function() {
            if (arguments.length > 0)
                for (var t = 0; t < arguments.length; t++)
                    this.connect(arguments[t]);
            return this
        }
        ,
        AudioNode.prototype.chain = n.prototype.chain,
        AudioNode.prototype.fan = n.prototype.fan,
        n.prototype.defaultArg = function(e, r) {
            if (this.isObject(e) && this.isObject(r)) {
                var n = {};
                for (var i in e)
                    n[i] = this.defaultArg(r[i], e[i]);
                for (var o in r)
                    n[o] = this.defaultArg(e[o], r[o]);
                return n
            }
            return t(e) ? r : e
        }
        ,
        n.prototype.optionsObject = function(t, e, r) {
            var n = {};
            if (1 === t.length && this.isObject(t[0]))
                n = t[0];
            else
                for (var i = 0; i < e.length; i++)
                    n[e[i]] = t[i];
            return this.isUndef(r) ? n : this.defaultArg(n, r)
        }
        ,
        n.prototype.isUndef = t,
        n.prototype.isFunction = e,
        n.prototype.isNumber = function(t) {
            return "number" == typeof t
        }
        ,
        n.prototype.isObject = function(t) {
            return "[object Object]" === Object.prototype.toString.call(t) && t.constructor === Object;
        }
        ,
        n.prototype.isBoolean = function(t) {
            return "boolean" == typeof t
        }
        ,
        n.prototype.isArray = function(t) {
            return Array.isArray(t)
        }
        ,
        n.prototype.isString = function(t) {
            return "string" == typeof t
        }
        ,
        n.noOp = function() {}
        ,
        n.prototype._readOnly = function(t) {
            if (Array.isArray(t))
                for (var e = 0; e < t.length; e++)
                    this._readOnly(t[e]);
            else
                Object.defineProperty(this, t, {
                    writable: !1,
                    enumerable: !0
                })
        }
        ,
        n.prototype._writable = function(t) {
            if (Array.isArray(t))
                for (var e = 0; e < t.length; e++)
                    this._writable(t[e]);
            else
                Object.defineProperty(this, t, {
                    writable: !0
                })
        }
        ,
        n.State = {
            Started: "started",
            Stopped: "stopped",
            Paused: "paused"
        },
        n.prototype.equalPowerScale = function(t) {
            var e = .5 * Math.PI;
            return Math.sin(t * e)
        }
        ,
        n.prototype.dbToGain = function(t) {
            return Math.pow(2, t / 6)
        }
        ,
        n.prototype.gainToDb = function(t) {
            return 20 * (Math.log(t) / Math.LN10)
        }
        ,
        n.prototype.now = function() {
            return this.context.currentTime
        }
        ,
        n.extend = function(e, r) {
            function i() {}
            t(r) && (r = n),
            i.prototype = r.prototype,
            e.prototype = new i,
            e.prototype.constructor = e,
            e._super = r
        }
        ;
        var o = [];
        return n._initAudioContext = function(t) {
            t(n.context),
            o.push(t)
        }
        ,
        n.setContext = function(t) {
            n.prototype.context = t,
            n.context = t;
            for (var e = 0; e < o.length; e++)
                o[e](t)
        }
        ,
        n.startMobile = function() {
            var t = n.context.createOscillator()
              , e = n.context.createGain();
            e.gain.value = 0,
            t.connect(e),
            e.connect(n.context.destination);
            var r = n.context.currentTime;
            t.start(r),
            t.stop(r + 1)
        }
        ,
        n._initAudioContext(function(t) {
            n.prototype.blockTime = 128 / t.sampleRate,
            i = t.createGain(),
            i.gain.value = 0,
            i.connect(t.destination)
        }),
        n.version = "r7-dev",
        n
    }();
    var Tone_signal_SignalBase;
    Tone_signal_SignalBase = function(t) {
        "use strict";
        return t.SignalBase = function() {}
        ,
        t.extend(t.SignalBase),
        t.SignalBase.prototype.connect = function(e, r, n) {
            return t.Signal && t.Signal === e.constructor || t.Param && t.Param === e.constructor || t.TimelineSignal && t.TimelineSignal === e.constructor ? (e._param.cancelScheduledValues(0),
            e._param.value = 0,
            e.overridden = !0) : e instanceof AudioParam && (e.cancelScheduledValues(0),
            e.value = 0),
            t.prototype.connect.call(this, e, r, n),
            this
        }
        ,
        t.SignalBase
    }(Tone_core_Tone);
    var Tone_signal_WaveShaper;
    Tone_signal_WaveShaper = function(t) {
        "use strict";
        return t.WaveShaper = function(t, e) {
            this._shaper = this.input = this.output = this.context.createWaveShaper(),
            this._curve = null,
            Array.isArray(t) ? this.curve = t : isFinite(t) || this.isUndef(t) ? this._curve = new Float32Array(this.defaultArg(t, 1024)) : this.isFunction(t) && (this._curve = new Float32Array(this.defaultArg(e, 1024)),
            this.setMap(t))
        }
        ,
        t.extend(t.WaveShaper, t.SignalBase),
        t.WaveShaper.prototype.setMap = function(t) {
            for (var e = 0, r = this._curve.length; r > e; e++) {
                var n = e / r * 2 - 1;
                this._curve[e] = t(n, e)
            }
            return this._shaper.curve = this._curve,
            this
        }
        ,
        Object.defineProperty(t.WaveShaper.prototype, "curve", {
            get: function() {
                return this._shaper.curve
            },
            set: function(t) {
                this._curve = new Float32Array(t),
                this._shaper.curve = this._curve
            }
        }),
        Object.defineProperty(t.WaveShaper.prototype, "oversample", {
            get: function() {
                return this._shaper.oversample
            },
            set: function(t) {
                if (-1 === ["none", "2x", "4x"].indexOf(t))
                    throw new Error("invalid oversampling: " + t);
                this._shaper.oversample = t
            }
        }),
        t.WaveShaper.prototype.dispose = function() {
            return t.prototype.dispose.call(this),
            this._shaper.disconnect(),
            this._shaper = null,
            this._curve = null,
            this
        }
        ,
        t.WaveShaper
    }(Tone_core_Tone);
    var Tone_core_Type;
    Tone_core_Type = function(Tone) {
        "use strict";
        function getTransportBpm() {
            return Tone.Transport && Tone.Transport.bpm ? Tone.Transport.bpm.value : 120
        }
        function getTransportTimeSignature() {
            return Tone.Transport && Tone.Transport.timeSignature ? Tone.Transport.timeSignature : 4
        }
        function toNotationHelper(t, e, r, n) {
            for (var i = this.toSeconds(t), o = this.notationToSeconds(n[n.length - 1], e, r), s = "", a = 0; a < n.length; a++) {
                var h = this.notationToSeconds(n[a], e, r)
                  , u = i / h
                  , l = 1e-6;
                if (l > 1 - u % 1 && (u += l),
                u = Math.floor(u),
                u > 0) {
                    if (s += 1 === u ? n[a] : u.toString() + "*" + n[a],
                    i -= u * h,
                    o > i)
                        break;
                    s += " + "
                }
            }
            return "" === s && (s = "0"),
            s
        }
        Tone.Type = {
            Default: "number",
            Time: "time",
            Frequency: "frequency",
            NormalRange: "normalRange",
            AudioRange: "audioRange",
            Decibels: "db",
            Interval: "interval",
            BPM: "bpm",
            Positive: "positive",
            Cents: "cents",
            Degrees: "degrees",
            MIDI: "midi",
            TransportTime: "transportTime",
            Ticks: "tick",
            Note: "note",
            Milliseconds: "milliseconds",
            Notation: "notation"
        },
        Tone.prototype.isNowRelative = function() {
            var t = new RegExp(/^\s*\+(.)+/i);
            return function(e) {
                return t.test(e)
            }
        }(),
        Tone.prototype.isTicks = function() {
            var t = new RegExp(/^\d+i$/i);
            return function(e) {
                return t.test(e)
            }
        }(),
        Tone.prototype.isNotation = function() {
            var t = new RegExp(/^[0-9]+[mnt]$/i);
            return function(e) {
                return t.test(e)
            }
        }(),
        Tone.prototype.isTransportTime = function() {
            var t = new RegExp(/^(\d+(\.\d+)?\:){1,2}(\d+(\.\d+)?)?$/i);
            return function(e) {
                return t.test(e)
            }
        }(),
        Tone.prototype.isNote = function() {
            var t = new RegExp(/^[a-g]{1}(b|#|x|bb)?-?[0-9]+$/i);
            return function(e) {
                return t.test(e)
            }
        }(),
        Tone.prototype.isFrequency = function() {
            var t = new RegExp(/^\d*\.?\d+hz$/i);
            return function(e) {
                return t.test(e)
            }
        }(),
        Tone.prototype.notationToSeconds = function(t, e, r) {
            e = this.defaultArg(e, getTransportBpm()),
            r = this.defaultArg(r, getTransportTimeSignature());
            var n = 60 / e;
            "1n" === t && (t = "1m");
            var i = parseInt(t, 10)
              , o = 0;
            0 === i && (o = 0);
            var s = t.slice(-1);
            return o = "t" === s ? 4 / i * 2 / 3 : "n" === s ? 4 / i : "m" === s ? i * r : 0,
            n * o
        }
        ,
        Tone.prototype.transportTimeToSeconds = function(t, e, r) {
            e = this.defaultArg(e, getTransportBpm()),
            r = this.defaultArg(r, getTransportTimeSignature());
            var n = 0
              , i = 0
              , o = 0
              , s = t.split(":");
            2 === s.length ? (n = parseFloat(s[0]),
            i = parseFloat(s[1])) : 1 === s.length ? i = parseFloat(s[0]) : 3 === s.length && (n = parseFloat(s[0]),
            i = parseFloat(s[1]),
            o = parseFloat(s[2]));
            var a = n * r + i + o / 4;
            return a * (60 / e)
        }
        ,
        Tone.prototype.ticksToSeconds = function(t, e) {
            if (this.isUndef(Tone.Transport))
                return 0;
            t = parseFloat(t),
            e = this.defaultArg(e, getTransportBpm());
            var r = 60 / e / Tone.Transport.PPQ;
            return r * t
        }
        ,
        Tone.prototype.frequencyToSeconds = function(t) {
            return 1 / parseFloat(t)
        }
        ,
        Tone.prototype.samplesToSeconds = function(t) {
            return t / this.context.sampleRate
        }
        ,
        Tone.prototype.secondsToSamples = function(t) {
            return t * this.context.sampleRate
        }
        ,
        Tone.prototype.secondsToTransportTime = function(t, e, r) {
            e = this.defaultArg(e, getTransportBpm()),
            r = this.defaultArg(r, getTransportTimeSignature());
            var n = 60 / e
              , i = t / n
              , o = Math.floor(i / r)
              , s = i % 1 * 4;
            i = Math.floor(i) % r;
            var a = [o, i, s];
            return a.join(":")
        }
        ,
        Tone.prototype.secondsToFrequency = function(t) {
            return 1 / t
        }
        ,
        Tone.prototype.toTransportTime = function(t, e, r) {
            var n = this.toSeconds(t);
            return this.secondsToTransportTime(n, e, r)
        }
        ,
        Tone.prototype.toFrequency = function(t, e) {
            return this.isFrequency(t) ? parseFloat(t) : this.isNotation(t) || this.isTransportTime(t) ? this.secondsToFrequency(this.toSeconds(t, e)) : this.isNote(t) ? this.noteToFrequency(t) : t
        }
        ,
        Tone.prototype.toTicks = function(t) {
            if (this.isUndef(Tone.Transport))
                return 0;
            var e = Tone.Transport.bpm.value
              , r = 0;
            if (this.isNowRelative(t))
                t = t.replace("+", ""),
                r = Tone.Transport.ticks;
            else if (this.isUndef(t))
                return Tone.Transport.ticks;
            var n = this.toSeconds(t)
              , i = 60 / e
              , o = n / i
              , s = o * Tone.Transport.PPQ;
            return Math.round(s + r)
        }
        ,
        Tone.prototype.toSamples = function(t) {
            var e = this.toSeconds(t);
            return Math.round(e * this.context.sampleRate)
        }
        ,
        Tone.prototype.toSeconds = function(time, now) {
            if (now = this.defaultArg(now, this.now()),
            this.isNumber(time))
                return time;
            if (this.isString(time)) {
                var plusTime = 0;
                this.isNowRelative(time) && (time = time.replace("+", ""),
                plusTime = now);
                var betweenParens = time.match(/\(([^)(]+)\)/g);
                if (betweenParens)
                    for (var j = 0; j < betweenParens.length; j++) {
                        var symbol = betweenParens[j].replace(/[\(\)]/g, "")
                          , symbolVal = this.toSeconds(symbol);
                        time = time.replace(betweenParens[j], symbolVal)
                    }
                if (-1 !== time.indexOf("@")) {
                    var quantizationSplit = time.split("@");
                    if (this.isUndef(Tone.Transport))
                        throw new Error("quantization requires Tone.Transport");
                    var toQuantize = quantizationSplit[0].trim();
                    "" === toQuantize && (toQuantize = void 0),
                    plusTime > 0 && (toQuantize = "+" + toQuantize,
                    plusTime = 0);
                    var subdivision = quantizationSplit[1].trim();
                    time = Tone.Transport.quantize(toQuantize, subdivision)
                } else {
                    var components = time.split(/[\(\)\-\+\/\*]/);
                    if (components.length > 1) {
                        for (var originalTime = time, i = 0; i < components.length; i++) {
                            var symb = components[i].trim();
                            if ("" !== symb) {
                                var val = this.toSeconds(symb);
                                time = time.replace(symb, val)
                            }
                        }
                        try {
                            time = eval(time)
                        } catch (e) {
                            throw new EvalError("cannot evaluate Time: " + originalTime)
                        }
                    } else
                        time = this.isNotation(time) ? this.notationToSeconds(time) : this.isTransportTime(time) ? this.transportTimeToSeconds(time) : this.isFrequency(time) ? this.frequencyToSeconds(time) : this.isTicks(time) ? this.ticksToSeconds(time) : parseFloat(time)
                }
                return time + plusTime
            }
            return now
        }
        ,
        Tone.prototype.toNotation = function(t, e, r) {
            var n = ["1m", "2n", "4n", "8n", "16n", "32n", "64n", "128n"]
              , i = toNotationHelper.call(this, t, e, r, n)
              , o = ["1m", "2n", "2t", "4n", "4t", "8n", "8t", "16n", "16t", "32n", "32t", "64n", "64t", "128n"]
              , s = toNotationHelper.call(this, t, e, r, o);
            return s.split("+").length < i.split("+").length ? s : i
        }
        ,
        Tone.prototype.fromUnits = function(t, e) {
            if (!this.convert && !this.isUndef(this.convert))
                return t;
            switch (e) {
            case Tone.Type.Time:
                return this.toSeconds(t);
            case Tone.Type.Frequency:
                return this.toFrequency(t);
            case Tone.Type.Decibels:
                return this.dbToGain(t);
            case Tone.Type.NormalRange:
                return Math.min(Math.max(t, 0), 1);
            case Tone.Type.AudioRange:
                return Math.min(Math.max(t, -1), 1);
            case Tone.Type.Positive:
                return Math.max(t, 0);
            default:
                return t
            }
        }
        ,
        Tone.prototype.toUnits = function(t, e) {
            if (!this.convert && !this.isUndef(this.convert))
                return t;
            switch (e) {
            case Tone.Type.Decibels:
                return this.gainToDb(t);
            default:
                return t
            }
        }
        ;
        var noteToScaleIndex = {
            cbb: -2,
            cb: -1,
            c: 0,
            "c#": 1,
            cx: 2,
            dbb: 0,
            db: 1,
            d: 2,
            "d#": 3,
            dx: 4,
            ebb: 2,
            eb: 3,
            e: 4,
            "e#": 5,
            ex: 6,
            fbb: 3,
            fb: 4,
            f: 5,
            "f#": 6,
            fx: 7,
            gbb: 5,
            gb: 6,
            g: 7,
            "g#": 8,
            gx: 9,
            abb: 7,
            ab: 8,
            a: 9,
            "a#": 10,
            ax: 11,
            bbb: 9,
            bb: 10,
            b: 11,
            "b#": 12,
            bx: 13
        }
          , scaleIndexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        return Tone.A4 = 440,
        Tone.prototype.noteToFrequency = function(t) {
            var e = t.split(/(-?\d+)/);
            if (3 === e.length) {
                var r = noteToScaleIndex[e[0].toLowerCase()]
                  , n = e[1]
                  , i = r + 12 * (parseInt(n, 10) + 1);
                return this.midiToFrequency(i)
            }
            return 0
        }
        ,
        Tone.prototype.frequencyToNote = function(t) {
            var e = Math.log(t / Tone.A4) / Math.LN2
              , r = Math.round(12 * e) + 57
              , n = Math.floor(r / 12);
            0 > n && (r += -12 * n);
            var i = scaleIndexToNote[r % 12];
            return i + n.toString()
        }
        ,
        Tone.prototype.intervalToFrequencyRatio = function(t) {
            return Math.pow(2, t / 12)
        }
        ,
        Tone.prototype.midiToNote = function(t) {
            var e = Math.floor(t / 12) - 1
              , r = t % 12;
            return scaleIndexToNote[r] + e
        }
        ,
        Tone.prototype.noteToMidi = function(t) {
            var e = t.split(/(\d+)/);
            if (3 === e.length) {
                var r = noteToScaleIndex[e[0].toLowerCase()]
                  , n = e[1];
                return r + 12 * (parseInt(n, 10) + 1)
            }
            return 0
        }
        ,
        Tone.prototype.midiToFrequency = function(t) {
            return Tone.A4 * Math.pow(2, (t - 69) / 12)
        }
        ,
        Tone
    }(Tone_core_Tone);
    var Tone_core_Param;
    Tone_core_Param = function(t) {
        "use strict";
        return t.Param = function() {
            var e = this.optionsObject(arguments, ["param", "units", "convert"], t.Param.defaults);
            this._param = this.input = e.param,
            this.units = e.units,
            this.convert = e.convert,
            this.overridden = !1,
            this.isUndef(e.value) || (this.value = e.value)
        }
        ,
        t.extend(t.Param),
        t.Param.defaults = {
            units: t.Type.Default,
            convert: !0,
            param: void 0
        },
        Object.defineProperty(t.Param.prototype, "value", {
            get: function() {
                return this._toUnits(this._param.value)
            },
            set: function(t) {
                var e = this._fromUnits(t);
                this._param.value = e
            }
        }),
        t.Param.prototype._fromUnits = function(e) {
            if (!this.convert && !this.isUndef(this.convert))
                return e;
            switch (this.units) {
            case t.Type.Time:
                return this.toSeconds(e);
            case t.Type.Frequency:
                return this.toFrequency(e);
            case t.Type.Decibels:
                return this.dbToGain(e);
            case t.Type.NormalRange:
                return Math.min(Math.max(e, 0), 1);
            case t.Type.AudioRange:
                return Math.min(Math.max(e, -1), 1);
            case t.Type.Positive:
                return Math.max(e, 0);
            default:
                return e
            }
        }
        ,
        t.Param.prototype._toUnits = function(e) {
            if (!this.convert && !this.isUndef(this.convert))
                return e;
            switch (this.units) {
            case t.Type.Decibels:
                return this.gainToDb(e);
            default:
                return e
            }
        }
        ,
        t.Param.prototype._minOutput = 1e-5,
        t.Param.prototype.setValueAtTime = function(t, e) {
            return t = this._fromUnits(t),
            this._param.setValueAtTime(t, this.toSeconds(e)),
            this
        }
        ,
        t.Param.prototype.setRampPoint = function(t) {
            t = this.defaultArg(t, this.now());
            var e = this._param.value;
            return this._param.setValueAtTime(e, t),
            this
        }
        ,
        t.Param.prototype.linearRampToValueAtTime = function(t, e) {
            return t = this._fromUnits(t),
            this._param.linearRampToValueAtTime(t, this.toSeconds(e)),
            this
        }
        ,
        t.Param.prototype.exponentialRampToValueAtTime = function(t, e) {
            return t = this._fromUnits(t),
            t = Math.max(this._minOutput, t),
            this._param.exponentialRampToValueAtTime(t, this.toSeconds(e)),
            this
        }
        ,
        t.Param.prototype.exponentialRampToValue = function(t, e) {
            var r = this.now()
              , n = this.value;
            return this.setValueAtTime(Math.max(n, this._minOutput), r),
            this.exponentialRampToValueAtTime(t, r + this.toSeconds(e)),
            this
        }
        ,
        t.Param.prototype.linearRampToValue = function(t, e) {
            var r = this.now();
            return this.setRampPoint(r),
            this.linearRampToValueAtTime(t, r + this.toSeconds(e)),
            this
        }
        ,
        t.Param.prototype.setTargetAtTime = function(t, e, r) {
            return t = this._fromUnits(t),
            t = Math.max(this._minOutput, t),
            r = Math.max(this._minOutput, r),
            this._param.setTargetAtTime(t, this.toSeconds(e), r),
            this
        }
        ,
        t.Param.prototype.setValueCurveAtTime = function(t, e, r) {
            for (var n = 0; n < t.length; n++)
                t[n] = this._fromUnits(t[n]);
            return this._param.setValueCurveAtTime(t, this.toSeconds(e), this.toSeconds(r)),
            this
        }
        ,
        t.Param.prototype.cancelScheduledValues = function(t) {
            return this._param.cancelScheduledValues(this.toSeconds(t)),
            this
        }
        ,
        t.Param.prototype.rampTo = function(e, r) {
            return r = this.defaultArg(r, 0),
            this.units === t.Type.Frequency || this.units === t.Type.BPM ? this.exponentialRampToValue(e, r) : this.linearRampToValue(e, r),
            this
        }
        ,
        t.Param.prototype.dispose = function() {
            return t.prototype.dispose.call(this),
            this._param = null,
            this
        }
        ,
        t.Param
    }(Tone_core_Tone);
    var Tone_core_Gain;
    Tone_core_Gain = function(t) {
        "use strict";
        return t.Gain = function() {
            var e = this.optionsObject(arguments, ["gain", "units"], t.Gain.defaults);
            this.input = this.output = this._gainNode = this.context.createGain(),
            this.gain = new t.Param({
                param: this._gainNode.gain,
                units: e.units,
                value: e.gain,
                convert: e.convert
            }),
            this._readOnly("gain")
        }
        ,
        t.extend(t.Gain),
        t.Gain.defaults = {
            gain: 1,
            convert: !0
        },
        t.Gain.prototype.dispose = function() {
            t.Param.prototype.dispose.call(this),
            this._gainNode.disconnect(),
            this._gainNode = null,
            this._writable("gain"),
            this.gain.dispose(),
            this.gain = null
        }
        ,
        t.Gain
    }(Tone_core_Tone, Tone_core_Param);
    var Tone_signal_Signal;
    Tone_signal_Signal = function(t) {
        "use strict";
        return t.Signal = function() {
            var e = this.optionsObject(arguments, ["value", "units"], t.Signal.defaults);
            this.output = this._gain = this.context.createGain(),
            e.param = this._gain.gain,
            t.Param.call(this, e),
            this.input = this._param = this._gain.gain,
            t.Signal._constant.chain(this._gain)
        }
        ,
        t.extend(t.Signal, t.Param),
        t.Signal.defaults = {
            value: 0,
            units: t.Type.Default,
            convert: !0
        },
        t.Signal.prototype.connect = t.SignalBase.prototype.connect,
        t.Signal.prototype.dispose = function() {
            return t.Param.prototype.dispose.call(this),
            this._param = null,
            this._gain.disconnect(),
            this._gain = null,
            this
        }
        ,
        t.Signal._constant = null,
        t._initAudioContext(function(e) {
            for (var r = e.createBuffer(1, 128, e.sampleRate), n = r.getChannelData(0), i = 0; i < n.length; i++)
                n[i] = 1;
            t.Signal._constant = e.createBufferSource(),
            t.Signal._constant.channelCount = 1,
            t.Signal._constant.channelCountMode = "explicit",
            t.Signal._constant.buffer = r,
            t.Signal._constant.loop = !0,
            t.Signal._constant.start(0),
            t.Signal._constant.noGC()
        }),
        t.Signal
    }(Tone_core_Tone, Tone_signal_WaveShaper, Tone_core_Type, Tone_core_Param);
    var Tone_signal_Add;
    Tone_signal_Add = function(t) {
        "use strict";
        return t.Add = function(e) {
            t.call(this, 2, 0),
            this._sum = this.input[0] = this.input[1] = this.output = this.context.createGain(),
            this._param = this.input[1] = new t.Signal(e),
            this._param.connect(this._sum)
        }
        ,
        t.extend(t.Add, t.Signal),
        t.Add.prototype.dispose = function() {
            return t.prototype.dispose.call(this),
            this._sum.disconnect(),
            this._sum = null,
            this._param.dispose(),
            this._param = null,
            this
        }
        ,
        t.Add
    }(Tone_core_Tone);
    var Tone_signal_Multiply;
    Tone_signal_Multiply = function(t) {
        "use strict";
        return t.Multiply = function(e) {
            t.call(this, 2, 0),
            this._mult = this.input[0] = this.output = this.context.createGain(),
            this._param = this.input[1] = this.output.gain,
            this._param.value = this.defaultArg(e, 0)
        }
        ,
        t.extend(t.Multiply, t.Signal),
        t.Multiply.prototype.dispose = function() {
            return t.prototype.dispose.call(this),
            this._mult.disconnect(),
            this._mult = null,
            this._param = null,
            this
        }
        ,
        t.Multiply
    }(Tone_core_Tone);
    var Tone_signal_Scale;
    Tone_signal_Scale = function(t) {
        "use strict";
        return t.Scale = function(e, r) {
            this._outputMin = this.defaultArg(e, 0),
            this._outputMax = this.defaultArg(r, 1),
            this._scale = this.input = new t.Multiply(1),
            this._add = this.output = new t.Add(0),
            this._scale.connect(this._add),
            this._setRange()
        }
        ,
        t.extend(t.Scale, t.SignalBase),
        Object.defineProperty(t.Scale.prototype, "min", {
            get: function() {
                return this._outputMin
            },
            set: function(t) {
                this._outputMin = t,
                this._setRange()
            }
        }),
        Object.defineProperty(t.Scale.prototype, "max", {
            get: function() {
                return this._outputMax
            },
            set: function(t) {
                this._outputMax = t,
                this._setRange()
            }
        }),
        t.Scale.prototype._setRange = function() {
            this._add.value = this._outputMin,
            this._scale.value = this._outputMax - this._outputMin
        }
        ,
        t.Scale.prototype.dispose = function() {
            return t.prototype.dispose.call(this),
            this._add.dispose(),
            this._add = null,
            this._scale.dispose(),
            this._scale = null,
            this
        }
        ,
        t.Scale
    }(Tone_core_Tone, Tone_signal_Add, Tone_signal_Multiply);
    var signal;
    signal = function() {
        "use strict";
        var t = Tone_signal_Signal
          , e = Tone_signal_Add
          , r = Tone_signal_Multiply
          , n = Tone_signal_Scale
          , i = Tone_core_Tone
          , o = master;
        i.setContext(o.audiocontext),
        p5.Signal = function(e) {
            var r = new t(e);
            return r
        }
        ,
        t.prototype.fade = t.prototype.linearRampToValueAtTime,
        r.prototype.fade = t.prototype.fade,
        e.prototype.fade = t.prototype.fade,
        n.prototype.fade = t.prototype.fade,
        t.prototype.setInput = function(t) {
            t.connect(this)
        }
        ,
        r.prototype.setInput = t.prototype.setInput,
        e.prototype.setInput = t.prototype.setInput,
        n.prototype.setInput = t.prototype.setInput,
        t.prototype.add = function(t) {
            var r = new e(t);
            return this.connect(r),
            r
        }
        ,
        r.prototype.add = t.prototype.add,
        e.prototype.add = t.prototype.add,
        n.prototype.add = t.prototype.add,
        t.prototype.mult = function(t) {
            var e = new r(t);
            return this.connect(e),
            e
        }
        ,
        r.prototype.mult = t.prototype.mult,
        e.prototype.mult = t.prototype.mult,
        n.prototype.mult = t.prototype.mult,
        t.prototype.scale = function(t, e, r, i) {
            var o, s;
            4 === arguments.length ? (o = p5.prototype.map(r, t, e, 0, 1) - .5,
            s = p5.prototype.map(i, t, e, 0, 1) - .5) : (o = arguments[0],
            s = arguments[1]);
            var a = new n(o,s);
            return this.connect(a),
            a
        }
        ,
        r.prototype.scale = t.prototype.scale,
        e.prototype.scale = t.prototype.scale,
        n.prototype.scale = t.prototype.scale
    }(Tone_signal_Signal, Tone_signal_Add, Tone_signal_Multiply, Tone_signal_Scale, Tone_core_Tone, master);
    var oscillator;
    oscillator = function() {
        "use strict";
        var t = master
          , e = Tone_signal_Add
          , r = Tone_signal_Multiply
          , n = Tone_signal_Scale;
        p5.Oscillator = function(e, r) {
            if ("string" == typeof e) {
                var n = r;
                r = e,
                e = n
            }
            if ("number" == typeof r) {
                var n = r;
                r = e,
                e = n
            }
            this.started = !1,
            this.phaseAmount = void 0,
            this.oscillator = t.audiocontext.createOscillator(),
            this.f = e || 440,
            this.oscillator.frequency.setValueAtTime(this.f, t.audiocontext.currentTime),
            this.oscillator.type = r || "sine",
            this.oscillator,
            this.input = t.audiocontext.createGain(),
            this.output = t.audiocontext.createGain(),
            this._freqMods = [],
            this.output.gain.value = .5,
            this.output.gain.setValueAtTime(.5, t.audiocontext.currentTime),
            this.oscillator.connect(this.output),
            this.panPosition = 0,
            this.connection = t.input,
            this.panner = new p5.Panner(this.output,this.connection,1),
            this.mathOps = [this.output],
            t.soundArray.push(this)
        }
        ,
        p5.Oscillator.prototype.start = function(e, r) {
            if (this.started) {
                var n = t.audiocontext.currentTime;
                this.stop(n)
            }
            if (!this.started) {
                var i = r || this.f
                  , o = this.oscillator.type;
                this.oscillator = t.audiocontext.createOscillator(),
                this.oscillator.frequency.exponentialRampToValueAtTime(Math.abs(i), t.audiocontext.currentTime),
                this.oscillator.type = o,
                this.oscillator.connect(this.output),
                e = e || 0,
                this.oscillator.start(e + t.audiocontext.currentTime),
                this.freqNode = this.oscillator.frequency;
                for (var s in this._freqMods)
                    "undefined" != typeof this._freqMods[s].connect && this._freqMods[s].connect(this.oscillator.frequency);
                this.started = !0
            }
        }
        ,
        p5.Oscillator.prototype.stop = function(e) {
            if (this.started) {
                var r = e || 0
                  , n = t.audiocontext.currentTime;
                this.oscillator.stop(r + n),
                this.started = !1
            }
        }
        ,
        p5.Oscillator.prototype.amp = function(e, r, n) {
            var i = this;
            if ("number" == typeof e) {
                var r = r || 0
                  , n = n || 0
                  , o = t.audiocontext.currentTime
                  , s = this.output.gain.value;
                this.output.gain.cancelScheduledValues(o),
                this.output.gain.linearRampToValueAtTime(s, o + n),
                this.output.gain.linearRampToValueAtTime(e, o + n + r)
            } else {
                if (!e)
                    return this.output.gain;
                e.connect(i.output.gain)
            }
        }
        ,
        p5.Oscillator.prototype.fade = p5.Oscillator.prototype.amp,
        p5.Oscillator.prototype.getAmp = function() {
            return this.output.gain.value
        }
        ,
        p5.Oscillator.prototype.freq = function(e, r, n) {
            if ("number" != typeof e || isNaN(e)) {
                if (!e)
                    return this.oscillator.frequency;
                e.output && (e = e.output),
                e.connect(this.oscillator.frequency),
                this._freqMods.push(e)
            } else {
                this.f = e;
                var i = t.audiocontext.currentTime
                  , r = r || 0
                  , n = n || 0;
                0 == r ? (this.oscillator.frequency.cancelScheduledValues(i),
                this.oscillator.frequency.setValueAtTime(e, n + i)) : e > 0 ? this.oscillator.frequency.exponentialRampToValueAtTime(e, n + r + i) : this.oscillator.frequency.linearRampToValueAtTime(e, n + r + i),
                this.phaseAmount && this.phase(this.phaseAmount)
            }
        }
        ,
        p5.Oscillator.prototype.getFreq = function() {
            return this.oscillator.frequency.value
        }
        ,
        p5.Oscillator.prototype.setType = function(t) {
            this.oscillator.type = t
        }
        ,
        p5.Oscillator.prototype.getType = function() {
            return this.oscillator.type
        }
        ,
        p5.Oscillator.prototype.connect = function(e) {
            e ? e.hasOwnProperty("input") ? (this.panner.connect(e.input),
            this.connection = e.input) : (this.panner.connect(e),
            this.connection = e) : this.panner.connect(t.input)
        }
        ,
        p5.Oscillator.prototype.disconnect = function(t) {
            this.output.disconnect(),
            this.panner.disconnect(),
            this.output.connect(this.panner),
            this.oscMods = []
        }
        ,
        p5.Oscillator.prototype.pan = function(t, e) {
            this.panPosition = t,
            this.panner.pan(t, e)
        }
        ,
        p5.Oscillator.prototype.getPan = function() {
            return this.panPosition
        }
        ,
        p5.Oscillator.prototype.dispose = function() {
            var e = t.soundArray.indexOf(this);
            if (t.soundArray.splice(e, 1),
            this.oscillator) {
                var r = t.audiocontext.currentTime;
                this.stop(r),
                this.disconnect(),
                this.oscillator.disconnect(),
                this.panner = null,
                this.oscillator = null
            }
            this.osc2 && this.osc2.dispose()
        }
        ,
        p5.Oscillator.prototype.phase = function(e) {
            var r = p5.prototype.map(e, 0, 1, 0, 1 / this.f)
              , n = t.audiocontext.currentTime;
            this.phaseAmount = e,
            this.dNode || (this.dNode = t.audiocontext.createDelay(),
            this.oscillator.disconnect(),
            this.oscillator.connect(this.dNode),
            this.dNode.connect(this.output)),
            this.dNode.delayTime.setValueAtTime(r, n)
        }
        ;
        var i = function(t, e, r, n, i) {
            var o = t.oscillator;
            for (var s in t.mathOps)
                t.mathOps[s]instanceof i && (o.disconnect(),
                t.mathOps[s].dispose(),
                r = s,
                r < t.mathOps.length - 2 && (n = t.mathOps[s + 1]));
            return r == t.mathOps.length - 1 && t.mathOps.push(n),
            s > 0 && (o = t.mathOps[s - 1]),
            o.disconnect(),
            o.connect(e),
            e.connect(n),
            t.mathOps[r] = e,
            t
        };
        p5.Oscillator.prototype.add = function(t) {
            var r = new e(t)
              , n = this.mathOps.length - 1
              , o = this.output;
            return i(this, r, n, o, e)
        }
        ,
        p5.Oscillator.prototype.mult = function(t) {
            var e = new r(t)
              , n = this.mathOps.length - 1
              , o = this.output;
            return i(this, e, n, o, r)
        }
        ,
        p5.Oscillator.prototype.scale = function(t, e, r, o) {
            var s, a;
            4 === arguments.length ? (s = p5.prototype.map(r, t, e, 0, 1) - .5,
            a = p5.prototype.map(o, t, e, 0, 1) - .5) : (s = arguments[0],
            a = arguments[1]);
            var h = new n(s,a)
              , u = this.mathOps.length - 1
              , l = this.output;
            return i(this, h, u, l, n)
        }
        ,
        p5.SinOsc = function(t) {
            p5.Oscillator.call(this, t, "sine")
        }
        ,
        p5.SinOsc.prototype = Object.create(p5.Oscillator.prototype),
        p5.TriOsc = function(t) {
            p5.Oscillator.call(this, t, "triangle")
        }
        ,
        p5.TriOsc.prototype = Object.create(p5.Oscillator.prototype),
        p5.SawOsc = function(t) {
            p5.Oscillator.call(this, t, "sawtooth")
        }
        ,
        p5.SawOsc.prototype = Object.create(p5.Oscillator.prototype),
        p5.SqrOsc = function(t) {
            p5.Oscillator.call(this, t, "square")
        }
        ,
        p5.SqrOsc.prototype = Object.create(p5.Oscillator.prototype)
    }(master, Tone_signal_Signal, Tone_signal_Add, Tone_signal_Multiply, Tone_signal_Scale);
    var Tone_core_Timeline;
    Tone_core_Timeline = function(t) {
        "use strict";
        return t.Timeline = function() {
            var e = this.optionsObject(arguments, ["memory"], t.Timeline.defaults);
            this._timeline = [],
            this._toRemove = [],
            this._iterating = !1,
            this.memory = e.memory
        }
        ,
        t.extend(t.Timeline),
        t.Timeline.defaults = {
            memory: 1 / 0
        },
        Object.defineProperty(t.Timeline.prototype, "length", {
            get: function() {
                return this._timeline.length
            }
        }),
        t.Timeline.prototype.addEvent = function(t) {
            if (this.isUndef(t.time))
                throw new Error("events must have a time attribute");
            if (t.time = this.toSeconds(t.time),
            this._timeline.length) {
                var e = this._search(t.time);
                this._timeline.splice(e + 1, 0, t)
            } else
                this._timeline.push(t);
            if (this.length > this.memory) {
                var r = this.length - this.memory;
                this._timeline.splice(0, r)
            }
            return this
        }
        ,
        t.Timeline.prototype.removeEvent = function(t) {
            if (this._iterating)
                this._toRemove.push(t);
            else {
                var e = this._timeline.indexOf(t);
                -1 !== e && this._timeline.splice(e, 1)
            }
            return this
        }
        ,
        t.Timeline.prototype.getEvent = function(t) {
            t = this.toSeconds(t);
            var e = this._search(t);
            return -1 !== e ? this._timeline[e] : null
        }
        ,
        t.Timeline.prototype.getEventAfter = function(t) {
            t = this.toSeconds(t);
            var e = this._search(t);
            return e + 1 < this._timeline.length ? this._timeline[e + 1] : null
        }
        ,
        t.Timeline.prototype.getEventBefore = function(t) {
            t = this.toSeconds(t);
            var e = this._search(t);
            return e - 1 >= 0 ? this._timeline[e - 1] : null
        }
        ,
        t.Timeline.prototype.cancel = function(t) {
            if (this._timeline.length > 1) {
                t = this.toSeconds(t);
                var e = this._search(t);
                e >= 0 ? this._timeline = this._timeline.slice(0, e) : this._timeline = []
            } else
                1 === this._timeline.length && this._timeline[0].time >= t && (this._timeline = []);
            return this
        }
        ,
        t.Timeline.prototype.cancelBefore = function(t) {
            if (this._timeline.length) {
                t = this.toSeconds(t);
                var e = this._search(t);
                e >= 0 && (this._timeline = this._timeline.slice(e + 1))
            }
            return this
        }
        ,
        t.Timeline.prototype._search = function(t) {
            for (var e = 0, r = this._timeline.length, n = r; n >= e && r > e; ) {
                var i = Math.floor(e + (n - e) / 2)
                  , o = this._timeline[i];
                if (o.time === t) {
                    for (var s = i; s < this._timeline.length; s++) {
                        var a = this._timeline[s];
                        a.time === t && (i = s)
                    }
                    return i
                }
                o.time > t ? n = i - 1 : o.time < t && (e = i + 1)
            }
            return e - 1
        }
        ,
        t.Timeline.prototype._iterate = function(t, e, r) {
            this._iterating = !0,
            e = this.defaultArg(e, 0),
            r = this.defaultArg(r, this._timeline.length - 1);
            for (var n = e; r >= n; n++)
                t(this._timeline[n]);
            if (this._iterating = !1,
            this._toRemove.length > 0) {
                for (var i = 0; i < this._toRemove.length; i++) {
                    var o = this._timeline.indexOf(this._toRemove[i]);
                    -1 !== o && this._timeline.splice(o, 1)
                }
                this._toRemove = []
            }
        }
        ,
        t.Timeline.prototype.forEach = function(t) {
            return this._iterate(t),
            this
        }
        ,
        t.Timeline.prototype.forEachBefore = function(t, e) {
            t = this.toSeconds(t);
            var r = this._search(t);
            return -1 !== r && this._iterate(e, 0, r),
            this
        }
        ,
        t.Timeline.prototype.forEachAfter = function(t, e) {
            t = this.toSeconds(t);
            var r = this._search(t);
            return this._iterate(e, r + 1),
            this
        }
        ,
        t.Timeline.prototype.forEachFrom = function(t, e) {
            t = this.toSeconds(t);
            for (var r = this._search(t); r >= 0 && this._timeline[r].time >= t; )
                r--;
            return this._iterate(e, r + 1),
            this
        }
        ,
        t.Timeline.prototype.forEachAtTime = function(t, e) {
            t = this.toSeconds(t);
            var r = this._search(t);
            return -1 !== r && this._iterate(function(r) {
                r.time === t && e(r)
            }, 0, r),
            this
        }
        ,
        t.Timeline.prototype.dispose = function() {
            t.prototype.dispose.call(this),
            this._timeline = null,
            this._toRemove = null
        }
        ,
        t.Timeline
    }(Tone_core_Tone);
    var Tone_signal_TimelineSignal;
    Tone_signal_TimelineSignal = function(t) {
        "use strict";
        return t.TimelineSignal = function() {
            var e = this.optionsObject(arguments, ["value", "units"], t.Signal.defaults);
            t.Signal.apply(this, e),
            e.param = this._param,
            t.Param.call(this, e),
            this._events = new t.Timeline(10),
            this._initial = this._fromUnits(this._param.value)
        }
        ,
        t.extend(t.TimelineSignal, t.Param),
        t.TimelineSignal.Type = {
            Linear: "linear",
            Exponential: "exponential",
            Target: "target",
            Set: "set"
        },
        Object.defineProperty(t.TimelineSignal.prototype, "value", {
            get: function() {
                return this._toUnits(this._param.value)
            },
            set: function(t) {
                var e = this._fromUnits(t);
                this._initial = e,
                this._param.value = e
            }
        }),
        t.TimelineSignal.prototype.setValueAtTime = function(e, r) {
            return e = this._fromUnits(e),
            r = this.toSeconds(r),
            this._events.addEvent({
                type: t.TimelineSignal.Type.Set,
                value: e,
                time: r
            }),
            this._param.setValueAtTime(e, r),
            this
        }
        ,
        t.TimelineSignal.prototype.linearRampToValueAtTime = function(e, r) {
            return e = this._fromUnits(e),
            r = this.toSeconds(r),
            this._events.addEvent({
                type: t.TimelineSignal.Type.Linear,
                value: e,
                time: r
            }),
            this._param.linearRampToValueAtTime(e, r),
            this
        }
        ,
        t.TimelineSignal.prototype.exponentialRampToValueAtTime = function(e, r) {
            return e = this._fromUnits(e),
            e = Math.max(this._minOutput, e),
            r = this.toSeconds(r),
            this._events.addEvent({
                type: t.TimelineSignal.Type.Exponential,
                value: e,
                time: r
            }),
            this._param.exponentialRampToValueAtTime(e, r),
            this
        }
        ,
        t.TimelineSignal.prototype.setTargetAtTime = function(e, r, n) {
            return e = this._fromUnits(e),
            e = Math.max(this._minOutput, e),
            n = Math.max(this._minOutput, n),
            r = this.toSeconds(r),
            this._events.addEvent({
                type: t.TimelineSignal.Type.Target,
                value: e,
                time: r,
                constant: n
            }),
            this._param.setTargetAtTime(e, r, n),
            this
        }
        ,
        t.TimelineSignal.prototype.cancelScheduledValues = function(t) {
            return this._events.cancel(t),
            this._param.cancelScheduledValues(this.toSeconds(t)),
            this
        }
        ,
        t.TimelineSignal.prototype.setRampPoint = function(e) {
            e = this.toSeconds(e);
            var r = this.getValueAtTime(e)
              , n = this._searchAfter(e);
            return n && (this.cancelScheduledValues(e),
            n.type === t.TimelineSignal.Type.Linear ? this.linearRampToValueAtTime(r, e) : n.type === t.TimelineSignal.Type.Exponential && this.exponentialRampToValueAtTime(r, e)),
            this.setValueAtTime(r, e),
            this
        }
        ,
        t.TimelineSignal.prototype.linearRampToValueBetween = function(t, e, r) {
            return this.setRampPoint(e),
            this.linearRampToValueAtTime(t, r),
            this
        }
        ,
        t.TimelineSignal.prototype.exponentialRampToValueBetween = function(t, e, r) {
            return this.setRampPoint(e),
            this.exponentialRampToValueAtTime(t, r),
            this
        }
        ,
        t.TimelineSignal.prototype._searchBefore = function(t) {
            return this._events.getEvent(t)
        }
        ,
        t.TimelineSignal.prototype._searchAfter = function(t) {
            return this._events.getEventAfter(t)
        }
        ,
        t.TimelineSignal.prototype.getValueAtTime = function(e) {
            var r = this._searchAfter(e)
              , n = this._searchBefore(e)
              , i = this._initial;
            if (null === n)
                i = this._initial;
            else if (n.type === t.TimelineSignal.Type.Target) {
                var o, s = this._events.getEventBefore(n.time);
                o = null === s ? this._initial : s.value,
                i = this._exponentialApproach(n.time, o, n.value, n.constant, e)
            } else
                i = null === r ? n.value : r.type === t.TimelineSignal.Type.Linear ? this._linearInterpolate(n.time, n.value, r.time, r.value, e) : r.type === t.TimelineSignal.Type.Exponential ? this._exponentialInterpolate(n.time, n.value, r.time, r.value, e) : n.value;
            return i
        }
        ,
        t.TimelineSignal.prototype.connect = t.SignalBase.prototype.connect,
        t.TimelineSignal.prototype._exponentialApproach = function(t, e, r, n, i) {
            return r + (e - r) * Math.exp(-(i - t) / n)
        }
        ,
        t.TimelineSignal.prototype._linearInterpolate = function(t, e, r, n, i) {
            return e + (n - e) * ((i - t) / (r - t))
        }
        ,
        t.TimelineSignal.prototype._exponentialInterpolate = function(t, e, r, n, i) {
            return e = Math.max(this._minOutput, e),
            e * Math.pow(n / e, (i - t) / (r - t))
        }
        ,
        t.TimelineSignal.prototype.dispose = function() {
            t.Signal.prototype.dispose.call(this),
            t.Param.prototype.dispose.call(this),
            this._events.dispose(),
            this._events = null
        }
        ,
        t.TimelineSignal
    }(Tone_core_Tone, Tone_signal_Signal);
    var env;
    env = function() {
        "use strict";
        var t = master
          , e = Tone_signal_Add
          , r = Tone_signal_Multiply
          , n = Tone_signal_Scale
          , i = Tone_signal_TimelineSignal
          , o = Tone_core_Tone;
        o.setContext(t.audiocontext),
        p5.Env = function(e, r, n, o, s, a) {
            t.audiocontext.currentTime,
            this.aTime = e || .1,
            this.aLevel = r || 1,
            this.dTime = n || .5,
            this.dLevel = o || 0,
            this.rTime = s || 0,
            this.rLevel = a || 0,
            this._rampHighPercentage = .98,
            this._rampLowPercentage = .02,
            this.output = t.audiocontext.createGain(),
            this.control = new i,
            this._init(),
            this.control.connect(this.output),
            this.connection = null,
            this.mathOps = [this.control],
            this.isExponential = !1,
            this.sourceToClear = null,
            this.wasTriggered = !1,
            t.soundArray.push(this)
        }
        ,
        p5.Env.prototype._init = function() {
            var e = t.audiocontext.currentTime
              , r = e;
            this.control.setTargetAtTime(1e-5, r, .001),
            this._setRampAD(this.aTime, this.dTime)
        }
        ,
        p5.Env.prototype.set = function(t, e, r, n, i, o) {
            this.aTime = t,
            this.aLevel = e,
            this.dTime = r || 0,
            this.dLevel = n || 0,
            this.rTime = t4 || 0,
            this.rLevel = l4 || 0,
            this._setRampAD(t, r)
        }
        ,
        p5.Env.prototype.setADSR = function(t, e, r, n) {
            this.aTime = t,
            this.dTime = e || 0,
            this.sPercent = r || 0,
            this.dLevel = "undefined" != typeof r ? r * (this.aLevel - this.rLevel) + this.rLevel : 0,
            this.rTime = n || 0,
            this._setRampAD(t, e)
        }
        ,
        p5.Env.prototype.setRange = function(t, e) {
            this.aLevel = t || 1,
            this.rLevel = e || 0
        }
        ,
        p5.Env.prototype._setRampAD = function(t, e) {
            this._rampAttackTime = this.checkExpInput(t),
            this._rampDecayTime = this.checkExpInput(e);
            var r = 1;
            r = Math.log(1 / this.checkExpInput(1 - this._rampHighPercentage)),
            this._rampAttackTC = t / this.checkExpInput(r),
            r = Math.log(1 / this._rampLowPercentage),
            this._rampDecayTC = e / this.checkExpInput(r)
        }
        ,
        p5.Env.prototype.setRampPercentages = function(t, e) {
            this._rampHighPercentage = this.checkExpInput(t),
            this._rampLowPercentage = this.checkExpInput(e);
            var r = 1;
            r = Math.log(1 / this.checkExpInput(1 - this._rampHighPercentage)),
            this._rampAttackTC = this._rampAttackTime / this.checkExpInput(r),
            r = Math.log(1 / this._rampLowPercentage),
            this._rampDecayTC = this._rampDecayTime / this.checkExpInput(r)
        }
        ,
        p5.Env.prototype.setInput = function(t) {
            for (var e = 0; e < arguments.length; e++)
                this.connect(arguments[e])
        }
        ,
        p5.Env.prototype.setExp = function(t) {
            this.isExponential = t
        }
        ,
        p5.Env.prototype.checkExpInput = function(t) {
            return 0 >= t && (t = 1e-4),
            t
        }
        ,
        p5.Env.prototype.play = function(e, r, n) {
            var i = (t.audiocontext.currentTime,
            r || 0)
              , n = n || 0;
            e && this.connection !== e && this.connect(e),
            this.triggerAttack(e, i),
            this.triggerRelease(e, i + this.aTime + this.dTime + n)
        }
        ,
        p5.Env.prototype.triggerAttack = function(e, r) {
            var n = t.audiocontext.currentTime
              , i = r || 0
              , o = n + i;
            this.lastAttack = o,
            this.wasTriggered = !0,
            e && this.connection !== e && this.connect(e);
            var s = this.control.getValueAtTime(o);
            this.control.cancelScheduledValues(o),
            1 == this.isExponential ? this.control.exponentialRampToValueAtTime(this.checkExpInput(s), o) : this.control.linearRampToValueAtTime(s, o),
            o += this.aTime,
            1 == this.isExponential ? (this.control.exponentialRampToValueAtTime(this.checkExpInput(this.aLevel), o),
            s = this.checkExpInput(this.control.getValueAtTime(o)),
            this.control.cancelScheduledValues(o),
            this.control.exponentialRampToValueAtTime(s, o)) : (this.control.linearRampToValueAtTime(this.aLevel, o),
            s = this.control.getValueAtTime(o),
            this.control.cancelScheduledValues(o),
            this.control.linearRampToValueAtTime(s, o)),
            o += this.dTime,
            1 == this.isExponential ? (this.control.exponentialRampToValueAtTime(this.checkExpInput(this.dLevel), o),
            s = this.checkExpInput(this.control.getValueAtTime(o)),
            this.control.cancelScheduledValues(o),
            this.control.exponentialRampToValueAtTime(s, o)) : (this.control.linearRampToValueAtTime(this.dLevel, o),
            s = this.control.getValueAtTime(o),
            this.control.cancelScheduledValues(o),
            this.control.linearRampToValueAtTime(s, o))
        }
        ,
        p5.Env.prototype.triggerRelease = function(e, r) {
            if (this.wasTriggered) {
                var n = t.audiocontext.currentTime
                  , i = r || 0
                  , o = n + i;
                e && this.connection !== e && this.connect(e);
                var s = this.control.getValueAtTime(o);
                this.control.cancelScheduledValues(o),
                1 == this.isExponential ? this.control.exponentialRampToValueAtTime(this.checkExpInput(s), o) : this.control.linearRampToValueAtTime(s, o),
                o += this.rTime,
                1 == this.isExponential ? (this.control.exponentialRampToValueAtTime(this.checkExpInput(this.rLevel), o),
                s = this.checkExpInput(this.control.getValueAtTime(o)),
                this.control.cancelScheduledValues(o),
                this.control.exponentialRampToValueAtTime(s, o)) : (this.control.linearRampToValueAtTime(this.rLevel, o),
                s = this.control.getValueAtTime(o),
                this.control.cancelScheduledValues(o),
                this.control.linearRampToValueAtTime(s, o)),
                this.wasTriggered = !1
            }
        }
        ,
        p5.Env.prototype.ramp = function(e, r, n, i) {
            var o = t.audiocontext.currentTime
              , s = r || 0
              , a = o + s
              , h = this.checkExpInput(n)
              , u = "undefined" != typeof i ? this.checkExpInput(i) : void 0;
            e && this.connection !== e && this.connect(e);
            var l = this.checkExpInput(this.control.getValueAtTime(a));
            this.control.cancelScheduledValues(a),
            h > l ? (this.control.setTargetAtTime(h, a, this._rampAttackTC),
            a += this._rampAttackTime) : l > h && (this.control.setTargetAtTime(h, a, this._rampDecayTC),
            a += this._rampDecayTime),
            void 0 !== u && (u > h ? this.control.setTargetAtTime(u, a, this._rampAttackTC) : h > u && this.control.setTargetAtTime(u, a, this._rampDecayTC))
        }
        ,
        p5.Env.prototype.connect = function(e) {
            this.connection = e,
            (e instanceof p5.Oscillator || e instanceof p5.SoundFile || e instanceof p5.AudioIn || e instanceof p5.Reverb || e instanceof p5.Noise || e instanceof p5.Filter || e instanceof p5.Delay) && (e = e.output.gain),
            e instanceof AudioParam && e.setValueAtTime(0, t.audiocontext.currentTime),
            e instanceof p5.Signal && e.setValue(0),
            this.output.connect(e)
        }
        ,
        p5.Env.prototype.disconnect = function(t) {
            this.output.disconnect()
        }
        ,
        p5.Env.prototype.add = function(t) {
            var r = new e(t)
              , n = this.mathOps.length
              , i = this.output;
            return p5.prototype._mathChain(this, r, n, i, e)
        }
        ,
        p5.Env.prototype.mult = function(t) {
            var e = new r(t)
              , n = this.mathOps.length
              , i = this.output;
            return p5.prototype._mathChain(this, e, n, i, r)
        }
        ,
        p5.Env.prototype.scale = function(t, e, r, i) {
            var o = new n(t,e,r,i)
              , s = this.mathOps.length
              , a = this.output;
            return p5.prototype._mathChain(this, o, s, a, n)
        }
        ,
        p5.Env.prototype.dispose = function() {
            var e = t.soundArray.indexOf(this);
            t.soundArray.splice(e, 1),
            t.audiocontext.currentTime,
            this.disconnect();
            try {
                this.control.dispose(),
                this.control = null
            } catch (r) {}
            for (var n = 1; n < this.mathOps.length; n++)
                mathOps[n].dispose()
        }
    }(master, Tone_signal_Add, Tone_signal_Multiply, Tone_signal_Scale, Tone_signal_TimelineSignal, Tone_core_Tone);
    var pulse;
    pulse = function() {
        "use strict";
        function t() {
            for (var t = e.audiocontext, r = t.createBuffer(1, 2048, t.sampleRate), n = r.getChannelData(0), i = 0; 2048 > i; i++)
                n[i] = 1;
            var o = t.createBufferSource();
            return o.buffer = r,
            o.loop = !0,
            o
        }
        var e = master;
        p5.Pulse = function(r, n) {
            p5.Oscillator.call(this, r, "sawtooth"),
            this.w = n || 0,
            this.osc2 = new p5.SawOsc(r),
            this.dNode = e.audiocontext.createDelay(),
            this.dcOffset = t(),
            this.dcGain = e.audiocontext.createGain(),
            this.dcOffset.connect(this.dcGain),
            this.dcGain.connect(this.output),
            this.f = r || 440;
            var i = this.w / this.oscillator.frequency.value;
            this.dNode.delayTime.value = i,
            this.dcGain.gain.value = 1.7 * (.5 - this.w),
            this.osc2.disconnect(),
            this.osc2.panner.disconnect(),
            this.osc2.amp(-1),
            this.osc2.output.connect(this.dNode),
            this.dNode.connect(this.output),
            this.output.gain.value = 1,
            this.output.connect(this.panner)
        }
        ,
        p5.Pulse.prototype = Object.create(p5.Oscillator.prototype),
        p5.Pulse.prototype.width = function(t) {
            if ("number" == typeof t) {
                if (1 >= t && t >= 0) {
                    this.w = t;
                    var e = this.w / this.oscillator.frequency.value;
                    this.dNode.delayTime.value = e
                }
                this.dcGain.gain.value = 1.7 * (.5 - this.w)
            } else {
                t.connect(this.dNode.delayTime);
                var r = new p5.SignalAdd(-.5);
                r.setInput(t),
                r = r.mult(-1),
                r = r.mult(1.7),
                r.connect(this.dcGain.gain)
            }
        }
        ,
        p5.Pulse.prototype.start = function(r, n) {
            var i = e.audiocontext.currentTime
              , o = n || 0;
            if (!this.started) {
                var s = r || this.f
                  , a = this.oscillator.type;
                this.oscillator = e.audiocontext.createOscillator(),
                this.oscillator.frequency.setValueAtTime(s, i),
                this.oscillator.type = a,
                this.oscillator.connect(this.output),
                this.oscillator.start(o + i),
                this.osc2.oscillator = e.audiocontext.createOscillator(),
                this.osc2.oscillator.frequency.setValueAtTime(s, o + i),
                this.osc2.oscillator.type = a,
                this.osc2.oscillator.connect(this.osc2.output),
                this.osc2.start(o + i),
                this.freqNode = [this.oscillator.frequency, this.osc2.oscillator.frequency],
                this.dcOffset = t(),
                this.dcOffset.connect(this.dcGain),
                this.dcOffset.start(o + i),
                void 0 !== this.mods && void 0 !== this.mods.frequency && (this.mods.frequency.connect(this.freqNode[0]),
                this.mods.frequency.connect(this.freqNode[1])),
                this.started = !0,
                this.osc2.started = !0
            }
        }
        ,
        p5.Pulse.prototype.stop = function(t) {
            if (this.started) {
                var r = t || 0
                  , n = e.audiocontext.currentTime;
                this.oscillator.stop(r + n),
                this.osc2.oscillator.stop(r + n),
                this.dcOffset.stop(r + n),
                this.started = !1,
                this.osc2.started = !1
            }
        }
        ,
        p5.Pulse.prototype.freq = function(t, r, n) {
            if ("number" == typeof t) {
                this.f = t;
                var i = e.audiocontext.currentTime
                  , r = r || 0
                  , n = n || 0
                  , o = this.oscillator.frequency.value;
                this.oscillator.frequency.cancelScheduledValues(i),
                this.oscillator.frequency.setValueAtTime(o, i + n),
                this.oscillator.frequency.exponentialRampToValueAtTime(t, n + r + i),
                this.osc2.oscillator.frequency.cancelScheduledValues(i),
                this.osc2.oscillator.frequency.setValueAtTime(o, i + n),
                this.osc2.oscillator.frequency.exponentialRampToValueAtTime(t, n + r + i),
                this.freqMod && (this.freqMod.output.disconnect(),
                this.freqMod = null)
            } else
                t.output && (t.output.disconnect(),
                t.output.connect(this.oscillator.frequency),
                t.output.connect(this.osc2.oscillator.frequency),
                this.freqMod = t)
        }
    }(master, oscillator);
    var noise;
    noise = function() {
        "use strict";
        var t = master;
        p5.Noise = function(t) {
            p5.Oscillator.call(this),
            delete this.f,
            delete this.freq,
            delete this.oscillator,
            this.buffer = e
        }
        ,
        p5.Noise.prototype = Object.create(p5.Oscillator.prototype);
        var e = function() {
            for (var e = 2 * t.audiocontext.sampleRate, r = t.audiocontext.createBuffer(1, e, t.audiocontext.sampleRate), n = r.getChannelData(0), i = 0; e > i; i++)
                n[i] = 2 * Math.random() - 1;
            return r.type = "white",
            r
        }()
          , r = function() {
            var e, r, n, i, o, s, a, h = 2 * t.audiocontext.sampleRate, u = t.audiocontext.createBuffer(1, h, t.audiocontext.sampleRate), l = u.getChannelData(0);
            e = r = n = i = o = s = a = 0;
            for (var p = 0; h > p; p++) {
                var c = 2 * Math.random() - 1;
                e = .99886 * e + .0555179 * c,
                r = .99332 * r + .0750759 * c,
                n = .969 * n + .153852 * c,
                i = .8665 * i + .3104856 * c,
                o = .55 * o + .5329522 * c,
                s = -.7616 * s - .016898 * c,
                l[p] = e + r + n + i + o + s + a + .5362 * c,
                l[p] *= .11,
                a = .115926 * c
            }
            return u.type = "pink",
            u
        }()
          , n = function() {
            for (var e = 2 * t.audiocontext.sampleRate, r = t.audiocontext.createBuffer(1, e, t.audiocontext.sampleRate), n = r.getChannelData(0), i = 0, o = 0; e > o; o++) {
                var s = 2 * Math.random() - 1;
                n[o] = (i + .02 * s) / 1.02,
                i = n[o],
                n[o] *= 3.5
            }
            return r.type = "brown",
            r
        }();
        p5.Noise.prototype.setType = function(i) {
            switch (i) {
            case "white":
                this.buffer = e;
                break;
            case "pink":
                this.buffer = r;
                break;
            case "brown":
                this.buffer = n;
                break;
            default:
                this.buffer = e
            }
            if (this.started) {
                var o = t.audiocontext.currentTime;
                this.stop(o),
                this.start(o + .01)
            }
        }
        ,
        p5.Noise.prototype.getType = function() {
            return this.buffer.type
        }
        ,
        p5.Noise.prototype.start = function() {
            this.started && this.stop(),
            this.noise = t.audiocontext.createBufferSource(),
            this.noise.buffer = this.buffer,
            this.noise.loop = !0,
            this.noise.connect(this.output);
            var e = t.audiocontext.currentTime;
            this.noise.start(e),
            this.started = !0
        }
        ,
        p5.Noise.prototype.stop = function() {
            var e = t.audiocontext.currentTime;
            this.noise && (this.noise.stop(e),
            this.started = !1)
        }
        ,
        p5.Noise.prototype.dispose = function() {
            var e = t.audiocontext.currentTime
              , r = t.soundArray.indexOf(this);
            t.soundArray.splice(r, 1),
            this.noise && (this.noise.disconnect(),
            this.stop(e)),
            this.output && this.output.disconnect(),
            this.panner && this.panner.disconnect(),
            this.output = null,
            this.panner = null,
            this.buffer = null,
            this.noise = null
        }
    }(master);
    var audioin;
    audioin = function() {
        "use strict";
        var t = master;
        p5.AudioIn = function() {
            this.input = t.audiocontext.createGain(),
            this.output = t.audiocontext.createGain(),
            this.stream = null,
            this.mediaStream = null,
            this.currentSource = 0,
            this.enabled = !1,
            this.amplitude = new p5.Amplitude,
            this.output.connect(this.amplitude.input),
            "undefined" == typeof window.MediaStreamTrack ? window.alert("This browser does not support MediaStreamTrack") : "function" == typeof window.MediaStreamTrack.getSources && window.MediaStreamTrack.getSources(this._gotSources),
            t.soundArray.push(this)
        }
        ,
        p5.AudioIn.prototype.start = function(e, r) {
            var n = this;
            if (t.inputSources[n.currentSource]) {
                var i = t.inputSources[n.currentSource].id
                  , o = {
                    audio: {
                        optional: [{
                            sourceId: i
                        }]
                    }
                };
                window.navigator.getUserMedia(o, this._onStream = function(r) {
                    n.stream = r,
                    n.enabled = !0,
                    n.mediaStream = t.audiocontext.createMediaStreamSource(r),
                    n.mediaStream.connect(n.output),
                    e && e(),
                    n.amplitude.setInput(n.output)
                }
                , this._onStreamError = function(t) {
                    r ? r(t) : console.error(t)
                }
                )
            } else
                window.navigator.getUserMedia({
                    audio: !0
                }, this._onStream = function(r) {
                    n.stream = r,
                    n.enabled = !0,
                    n.mediaStream = t.audiocontext.createMediaStreamSource(r),
                    n.mediaStream.connect(n.output),
                    n.amplitude.setInput(n.output),
                    e && e()
                }
                , this._onStreamError = function(t) {
                    r ? r(t) : console.error(t)
                }
                )
        }
        ,
        p5.AudioIn.prototype.stop = function() {
            this.stream && this.stream.stop()
        }
        ,
        p5.AudioIn.prototype.connect = function(e) {
            e ? e.hasOwnProperty("input") ? this.output.connect(e.input) : e.hasOwnProperty("analyser") ? this.output.connect(e.analyser) : this.output.connect(e) : this.output.connect(t.input)
        }
        ,
        p5.AudioIn.prototype.disconnect = function(t) {
            this.output.disconnect(t),
            this.output.connect(this.amplitude.input)
        }
        ,
        p5.AudioIn.prototype.getLevel = function(t) {
            return t && (this.amplitude.smoothing = t),
            this.amplitude.getLevel()
        }
        ,
        p5.AudioIn.prototype._gotSources = function(t) {
            for (var e = 0; e < t.length; e++) {
                var r = t[e];
                if ("audio" === r.kind)
                    return r
            }
        }
        ,
        p5.AudioIn.prototype.amp = function(e, r) {
            if (r) {
                var n = r || 0
                  , i = this.output.gain.value;
                this.output.gain.cancelScheduledValues(t.audiocontext.currentTime),
                this.output.gain.setValueAtTime(i, t.audiocontext.currentTime),
                this.output.gain.linearRampToValueAtTime(e, n + t.audiocontext.currentTime)
            } else
                this.output.gain.cancelScheduledValues(t.audiocontext.currentTime),
                this.output.gain.setValueAtTime(e, t.audiocontext.currentTime)
        }
        ,
        p5.AudioIn.prototype.listSources = function() {
            return console.log("listSources is deprecated - please use AudioIn.getSources"),
            console.log("input sources: "),
            t.inputSources.length > 0 ? t.inputSources : "This browser does not support MediaStreamTrack.getSources()"
        }
        ,
        p5.AudioIn.prototype.getSources = function(e) {
            "function" == typeof window.MediaStreamTrack.getSources ? window.MediaStreamTrack.getSources(function(r) {
                for (var n = 0, i = r.length; i > n; n++) {
                    var o = r[n];
                    "audio" === o.kind && t.inputSources.push(o)
                }
                e(t.inputSources)
            }) : console.log("This browser does not support MediaStreamTrack.getSources()")
        }
        ,
        p5.AudioIn.prototype.setSource = function(e) {
            var r = this;
            t.inputSources.length > 0 && e < t.inputSources.length ? (r.currentSource = e,
            console.log("set source to " + t.inputSources[r.currentSource].id)) : console.log("unable to set input source")
        }
        ,
        p5.AudioIn.prototype.dispose = function() {
            var e = t.soundArray.indexOf(this);
            t.soundArray.splice(e, 1),
            this.stop(),
            this.output && this.output.disconnect(),
            this.amplitude && this.amplitude.disconnect(),
            this.amplitude = null,
            this.output = null
        }
    }(master, errorHandler);
    var filter;
    filter = function() {
        "use strict";
        var t = master;
        p5.Filter = function(e) {
            this.ac = t.audiocontext,
            this.input = this.ac.createGain(),
            this.output = this.ac.createGain(),
            this.biquad = this.ac.createBiquadFilter(),
            this.input.connect(this.biquad),
            this.biquad.connect(this.output),
            this.connect(),
            e && this.setType(e),
            t.soundArray.push(this)
        }
        ,
        p5.Filter.prototype.process = function(t, e, r) {
            t.connect(this.input),
            this.set(e, r)
        }
        ,
        p5.Filter.prototype.set = function(t, e, r) {
            t && this.freq(t, r),
            e && this.res(e, r)
        }
        ,
        p5.Filter.prototype.freq = function(t, e) {
            var r = this
              , n = e || 0;
            return 0 >= t && (t = 1),
            "number" == typeof t ? (r.biquad.frequency.value = t,
            r.biquad.frequency.cancelScheduledValues(this.ac.currentTime + .01 + n),
            r.biquad.frequency.exponentialRampToValueAtTime(t, this.ac.currentTime + .02 + n)) : t && t.connect(this.biquad.frequency),
            r.biquad.frequency.value
        }
        ,
        p5.Filter.prototype.res = function(t, e) {
            var r = this
              , n = e || 0;
            return "number" == typeof t ? (r.biquad.Q.value = t,
            r.biquad.Q.cancelScheduledValues(r.ac.currentTime + .01 + n),
            r.biquad.Q.linearRampToValueAtTime(t, r.ac.currentTime + .02 + n)) : t && freq.connect(this.biquad.Q),
            r.biquad.Q.value
        }
        ,
        p5.Filter.prototype.setType = function(t) {
            this.biquad.type = t
        }
        ,
        p5.Filter.prototype.amp = function(e, r, n) {
            var r = r || 0
              , n = n || 0
              , i = t.audiocontext.currentTime
              , o = this.output.gain.value;
            this.output.gain.cancelScheduledValues(i),
            this.output.gain.linearRampToValueAtTime(o, i + n + .001),
            this.output.gain.linearRampToValueAtTime(e, i + n + r + .001)
        }
        ,
        p5.Filter.prototype.connect = function(t) {
            var e = t || p5.soundOut.input;
            this.output.connect(e)
        }
        ,
        p5.Filter.prototype.disconnect = function() {
            this.output.disconnect()
        }
        ,
        p5.Filter.prototype.dispose = function() {
            var e = t.soundArray.indexOf(this);
            t.soundArray.splice(e, 1),
            this.input.disconnect(),
            this.input = void 0,
            this.output.disconnect(),
            this.output = void 0,
            this.biquad.disconnect(),
            this.biquad = void 0
        }
        ,
        p5.LowPass = function() {
            p5.Filter.call(this, "lowpass")
        }
        ,
        p5.LowPass.prototype = Object.create(p5.Filter.prototype),
        p5.HighPass = function() {
            p5.Filter.call(this, "highpass")
        }
        ,
        p5.HighPass.prototype = Object.create(p5.Filter.prototype),
        p5.BandPass = function() {
            p5.Filter.call(this, "bandpass")
        }
        ,
        p5.BandPass.prototype = Object.create(p5.Filter.prototype)
    }(master);
    var delay;
    delay = function() {
        "use strict";
        var t = master;
        p5.Delay = function() {
            this.ac = t.audiocontext,
            this.input = this.ac.createGain(),
            this.output = this.ac.createGain(),
            this._split = this.ac.createChannelSplitter(2),
            this._merge = this.ac.createChannelMerger(2),
            this._leftGain = this.ac.createGain(),
            this._rightGain = this.ac.createGain(),
            this.leftDelay = this.ac.createDelay(),
            this.rightDelay = this.ac.createDelay(),
            this._leftFilter = new p5.Filter,
            this._rightFilter = new p5.Filter,
            this._leftFilter.disconnect(),
            this._rightFilter.disconnect(),
            this._leftFilter.biquad.frequency.setValueAtTime(1200, this.ac.currentTime),
            this._rightFilter.biquad.frequency.setValueAtTime(1200, this.ac.currentTime),
            this._leftFilter.biquad.Q.setValueAtTime(.3, this.ac.currentTime),
            this._rightFilter.biquad.Q.setValueAtTime(.3, this.ac.currentTime),
            this.input.connect(this._split),
            this.leftDelay.connect(this._leftGain),
            this.rightDelay.connect(this._rightGain),
            this._leftGain.connect(this._leftFilter.input),
            this._rightGain.connect(this._rightFilter.input),
            this._merge.connect(this.output),
            this.output.connect(p5.soundOut.input),
            this._leftFilter.biquad.gain.setValueAtTime(1, this.ac.currentTime),
            this._rightFilter.biquad.gain.setValueAtTime(1, this.ac.currentTime),
            this.setType(0),
            this._maxDelay = this.leftDelay.delayTime.maxValue,
            t.soundArray.push(this)
        }
        ,
        p5.Delay.prototype.process = function(t, e, r, n) {
            var i = r || 0
              , o = e || 0;
            if (i >= 1)
                throw new Error("Feedback value will force a positive feedback loop.");
            if (o >= this._maxDelay)
                throw new Error("Delay Time exceeds maximum delay time of " + this._maxDelay + " second.");
            t.connect(this.input),
            this.leftDelay.delayTime.setValueAtTime(o, this.ac.currentTime),
            this.rightDelay.delayTime.setValueAtTime(o, this.ac.currentTime),
            this._leftGain.gain.setValueAtTime(i, this.ac.currentTime),
            this._rightGain.gain.setValueAtTime(i, this.ac.currentTime),
            n && (this._leftFilter.freq(n),
            this._rightFilter.freq(n))
        }
        ,
        p5.Delay.prototype.delayTime = function(t) {
            "number" != typeof t ? (t.connect(this.leftDelay.delayTime),
            t.connect(this.rightDelay.delayTime)) : (this.leftDelay.delayTime.cancelScheduledValues(this.ac.currentTime),
            this.rightDelay.delayTime.cancelScheduledValues(this.ac.currentTime),
            this.leftDelay.delayTime.linearRampToValueAtTime(t, this.ac.currentTime),
            this.rightDelay.delayTime.linearRampToValueAtTime(t, this.ac.currentTime))
        }
        ,
        p5.Delay.prototype.feedback = function(t) {
            if ("number" != typeof t)
                t.connect(this._leftGain.gain),
                t.connect(this._rightGain.gain);
            else {
                if (t >= 1)
                    throw new Error("Feedback value will force a positive feedback loop.");
                this._leftGain.gain.exponentialRampToValueAtTime(t, this.ac.currentTime),
                this._rightGain.gain.exponentialRampToValueAtTime(t, this.ac.currentTime)
            }
        }
        ,
        p5.Delay.prototype.filter = function(t, e) {
            this._leftFilter.set(t, e),
            this._rightFilter.set(t, e)
        }
        ,
        p5.Delay.prototype.setType = function(t) {
            switch (1 === t && (t = "pingPong"),
            this._split.disconnect(),
            this._leftFilter.disconnect(),
            this._rightFilter.disconnect(),
            this._split.connect(this.leftDelay, 0),
            this._split.connect(this.rightDelay, 1),
            t) {
            case "pingPong":
                this._rightFilter.setType(this._leftFilter.biquad.type),
                this._leftFilter.output.connect(this._merge, 0, 0),
                this._rightFilter.output.connect(this._merge, 0, 1),
                this._leftFilter.output.connect(this.rightDelay),
                this._rightFilter.output.connect(this.leftDelay);
                break;
            default:
                this._leftFilter.output.connect(this._merge, 0, 0),
                this._leftFilter.output.connect(this._merge, 0, 1),
                this._leftFilter.output.connect(this.leftDelay),
                this._leftFilter.output.connect(this.rightDelay)
            }
        }
        ,
        p5.Delay.prototype.amp = function(e, r, n) {
            var r = r || 0
              , n = n || 0
              , i = t.audiocontext.currentTime
              , o = this.output.gain.value;
            this.output.gain.cancelScheduledValues(i),
            this.output.gain.linearRampToValueAtTime(o, i + n + .001),
            this.output.gain.linearRampToValueAtTime(e, i + n + r + .001)
        }
        ,
        p5.Delay.prototype.connect = function(t) {
            var e = t || p5.soundOut.input;
            this.output.connect(e)
        }
        ,
        p5.Delay.prototype.disconnect = function() {
            this.output.disconnect()
        }
        ,
        p5.Delay.prototype.dispose = function() {
            var e = t.soundArray.indexOf(this);
            t.soundArray.splice(e, 1),
            this.input.disconnect(),
            this.output.disconnect(),
            this._split.disconnect(),
            this._leftFilter.disconnect(),
            this._rightFilter.disconnect(),
            this._merge.disconnect(),
            this._leftGain.disconnect(),
            this._rightGain.disconnect(),
            this.leftDelay.disconnect(),
            this.rightDelay.disconnect(),
            this.input = void 0,
            this.output = void 0,
            this._split = void 0,
            this._leftFilter = void 0,
            this._rightFilter = void 0,
            this._merge = void 0,
            this._leftGain = void 0,
            this._rightGain = void 0,
            this.leftDelay = void 0,
            this.rightDelay = void 0
        }
    }(master, filter);
    var reverb;
    reverb = function() {
        "use strict";
        var t = master
          , e = errorHandler;
        p5.Reverb = function() {
            this.ac = t.audiocontext,
            this.convolverNode = this.ac.createConvolver(),
            this.input = this.ac.createGain(),
            this.output = this.ac.createGain(),
            this.input.gain.value = .5,
            this.input.connect(this.convolverNode),
            this.convolverNode.connect(this.output),
            this._seconds = 3,
            this._decay = 2,
            this._reverse = !1,
            this._buildImpulse(),
            this.connect(),
            t.soundArray.push(this)
        }
        ,
        p5.Reverb.prototype.process = function(t, e, r, n) {
            t.connect(this.input);
            var i = !1;
            e && (this._seconds = e,
            i = !0),
            r && (this._decay = r),
            n && (this._reverse = n),
            i && this._buildImpulse()
        }
        ,
        p5.Reverb.prototype.set = function(t, e, r) {
            var n = !1;
            t && (this._seconds = t,
            n = !0),
            e && (this._decay = e),
            r && (this._reverse = r),
            n && this._buildImpulse()
        }
        ,
        p5.Reverb.prototype.amp = function(e, r, n) {
            var r = r || 0
              , n = n || 0
              , i = t.audiocontext.currentTime
              , o = this.output.gain.value;
            this.output.gain.cancelScheduledValues(i),
            this.output.gain.linearRampToValueAtTime(o, i + n + .001),
            this.output.gain.linearRampToValueAtTime(e, i + n + r + .001)
        }
        ,
        p5.Reverb.prototype.connect = function(t) {
            var e = t || p5.soundOut.input;
            this.output.connect(e.input ? e.input : e)
        }
        ,
        p5.Reverb.prototype.disconnect = function() {
            this.output.disconnect()
        }
        ,
        p5.Reverb.prototype._buildImpulse = function() {
            var t, e, r = this.ac.sampleRate, n = r * this._seconds, i = this._decay, o = this.ac.createBuffer(2, n, r), s = o.getChannelData(0), a = o.getChannelData(1);
            for (e = 0; n > e; e++)
                t = this.reverse ? n - e : e,
                s[e] = (2 * Math.random() - 1) * Math.pow(1 - t / n, i),
                a[e] = (2 * Math.random() - 1) * Math.pow(1 - t / n, i);
            this.convolverNode.buffer = o
        }
        ,
        p5.Reverb.prototype.dispose = function() {
            var e = t.soundArray.indexOf(this);
            t.soundArray.splice(e, 1),
            this.convolverNode && (this.convolverNode.buffer = null,
            this.convolverNode = null),
            "undefined" != typeof this.output && (this.output.disconnect(),
            this.output = null),
            "undefined" != typeof this.panner && (this.panner.disconnect(),
            this.panner = null)
        }
        ,
        p5.Convolver = function(e, r, n) {
            this.ac = t.audiocontext,
            this.convolverNode = this.ac.createConvolver(),
            this.input = this.ac.createGain(),
            this.output = this.ac.createGain(),
            this.input.gain.value = .5,
            this.input.connect(this.convolverNode),
            this.convolverNode.connect(this.output),
            e ? (this.impulses = [],
            this._loadBuffer(e, r, n)) : (this._seconds = 3,
            this._decay = 2,
            this._reverse = !1,
            this._buildImpulse()),
            this.connect(),
            t.soundArray.push(this)
        }
        ,
        p5.Convolver.prototype = Object.create(p5.Reverb.prototype),
        p5.prototype.registerPreloadMethod("createConvolver", p5.prototype),
        p5.prototype.createConvolver = function(t, e, r) {
            window.location.origin.indexOf("file://") > -1 && "undefined" === window.cordova && alert("This sketch may require a server to load external files. Please see http://bit.ly/1qcInwS");
            var n = new p5.Convolver(t,e,r);
            return n.impulses = [],
            n
        }
        ,
        p5.Convolver.prototype._loadBuffer = function(t, r, n) {
            var t = p5.prototype._checkFileFormats(t)
              , i = this
              , o = (new Error).stack
              , s = p5.prototype.getAudioContext()
              , a = new XMLHttpRequest;
            a.open("GET", t, !0),
            a.responseType = "arraybuffer",
            a.onload = function() {
                if (200 == a.status)
                    s.decodeAudioData(a.response, function(e) {
                        var n = {}
                          , o = t.split("/");
                        n.name = o[o.length - 1],
                        n.audioBuffer = e,
                        i.impulses.push(n),
                        i.convolverNode.buffer = n.audioBuffer,
                        r && r(n)
                    }, function(t) {
                        var r = new e("decodeAudioData",o,i.url)
                          , s = "AudioContext error at decodeAudioData for " + i.url;
                        n ? (r.msg = s,
                        n(r)) : console.error(s + "\n The error stack trace includes: \n" + r.stack)
                    });
                else {
                    var h = new e("loadConvolver",o,i.url)
                      , u = "Unable to load " + i.url + ". The request status was: " + a.status + " (" + a.statusText + ")";
                    n ? (h.message = u,
                    n(h)) : console.error(u + "\n The error stack trace includes: \n" + h.stack)
                }
            }
            ,
            a.onerror = function(t) {
                var r = new e("loadConvolver",o,i.url)
                  , s = "There was no response from the server at " + i.url + ". Check the url and internet connectivity.";
                n ? (r.message = s,
                n(r)) : console.error(s + "\n The error stack trace includes: \n" + r.stack)
            }
            ,
            a.send()
        }
        ,
        p5.Convolver.prototype.set = null,
        p5.Convolver.prototype.process = function(t) {
            t.connect(this.input)
        }
        ,
        p5.Convolver.prototype.impulses = [],
        p5.Convolver.prototype.addImpulse = function(t, e, r) {
            window.location.origin.indexOf("file://") > -1 && "undefined" === window.cordova && alert("This sketch may require a server to load external files. Please see http://bit.ly/1qcInwS"),
            this._loadBuffer(t, e, r)
        }
        ,
        p5.Convolver.prototype.resetImpulse = function(t, e, r) {
            window.location.origin.indexOf("file://") > -1 && "undefined" === window.cordova && alert("This sketch may require a server to load external files. Please see http://bit.ly/1qcInwS"),
            this.impulses = [],
            this._loadBuffer(t, e, r)
        }
        ,
        p5.Convolver.prototype.toggleImpulse = function(t) {
            if ("number" == typeof t && t < this.impulses.length && (this.convolverNode.buffer = this.impulses[t].audioBuffer),
            "string" == typeof t)
                for (var e = 0; e < this.impulses.length; e++)
                    if (this.impulses[e].name === t) {
                        this.convolverNode.buffer = this.impulses[e].audioBuffer;
                        break
                    }
        }
        ,
        p5.Convolver.prototype.dispose = function() {
            for (var t in this.impulses)
                this.impulses[t] = null;
            this.convolverNode.disconnect(),
            this.concolverNode = null,
            "undefined" != typeof this.output && (this.output.disconnect(),
            this.output = null),
            "undefined" != typeof this.panner && (this.panner.disconnect(),
            this.panner = null)
        }
    }(master, errorHandler, sndcore);
    var Tone_core_TimelineState;
    Tone_core_TimelineState = function(t) {
        "use strict";
        return t.TimelineState = function(e) {
            t.Timeline.call(this),
            this._initial = e
        }
        ,
        t.extend(t.TimelineState, t.Timeline),
        t.TimelineState.prototype.getStateAtTime = function(t) {
            var e = this.getEvent(t);
            return null !== e ? e.state : this._initial
        }
        ,
        t.TimelineState.prototype.setStateAtTime = function(t, e) {
            this.addEvent({
                state: t,
                time: this.toSeconds(e)
            })
        }
        ,
        t.TimelineState
    }(Tone_core_Tone, Tone_core_Timeline);
    var Tone_core_Clock;
    Tone_core_Clock = function(t) {
        "use strict";
        return t.Clock = function() {
            var e = this.optionsObject(arguments, ["callback", "frequency"], t.Clock.defaults);
            this.callback = e.callback,
            this._lookAhead = "auto",
            this._computedLookAhead = 1 / 60,
            this._threshold = .5,
            this._nextTick = -1,
            this._lastUpdate = 0,
            this._loopID = -1,
            this.frequency = new t.TimelineSignal(e.frequency,t.Type.Frequency),
            this.ticks = 0,
            this._state = new t.TimelineState(t.State.Stopped),
            this._boundLoop = this._loop.bind(this),
            this._readOnly("frequency"),
            this._loop()
        }
        ,
        t.extend(t.Clock),
        t.Clock.defaults = {
            callback: t.noOp,
            frequency: 1,
            lookAhead: "auto"
        },
        Object.defineProperty(t.Clock.prototype, "state", {
            get: function() {
                return this._state.getStateAtTime(this.now())
            }
        }),
        Object.defineProperty(t.Clock.prototype, "lookAhead", {
            get: function() {
                return this._lookAhead
            },
            set: function(t) {
                "auto" === t ? this._lookAhead = "auto" : this._lookAhead = this.toSeconds(t)
            }
        }),
        t.Clock.prototype.start = function(e, r) {
            return e = this.toSeconds(e),
            this._state.getStateAtTime(e) !== t.State.Started && this._state.addEvent({
                state: t.State.Started,
                time: e,
                offset: r
            }),
            this
        }
        ,
        t.Clock.prototype.stop = function(e) {
            return e = this.toSeconds(e),
            this._state.getStateAtTime(e) !== t.State.Stopped && this._state.setStateAtTime(t.State.Stopped, e),
            this
        }
        ,
        t.Clock.prototype.pause = function(e) {
            return e = this.toSeconds(e),
            this._state.getStateAtTime(e) === t.State.Started && this._state.setStateAtTime(t.State.Paused, e),
            this
        }
        ,
        t.Clock.prototype._loop = function(e) {
            if (this._loopID = requestAnimationFrame(this._boundLoop),
            "auto" === this._lookAhead) {
                if (!this.isUndef(e)) {
                    var r = (e - this._lastUpdate) / 1e3;
                    this._lastUpdate = e,
                    r < this._threshold && (this._computedLookAhead = (9 * this._computedLookAhead + r) / 10)
                }
            } else
                this._computedLookAhead = this._lookAhead;
            var n = this.now()
              , i = 2 * this._computedLookAhead
              , o = this._state.getEvent(n + i)
              , s = t.State.Stopped;
            if (o && (s = o.state,
            -1 === this._nextTick && s === t.State.Started && (this._nextTick = o.time,
            this.isUndef(o.offset) || (this.ticks = o.offset))),
            s === t.State.Started)
                for (; n + i > this._nextTick; ) {
                    n > this._nextTick + this._threshold && (this._nextTick = n);
                    var a = this._nextTick;
                    this._nextTick += 1 / this.frequency.getValueAtTime(this._nextTick),
                    this.callback(a),
                    this.ticks++
                }
            else
                s === t.State.Stopped && (this._nextTick = -1,
                this.ticks = 0)
        }
        ,
        t.Clock.prototype.getStateAtTime = function(t) {
            return this._state.getStateAtTime(t)
        }
        ,
        t.Clock.prototype.dispose = function() {
            cancelAnimationFrame(this._loopID),
            t.TimelineState.prototype.dispose.call(this),
            this._writable("frequency"),
            this.frequency.dispose(),
            this.frequency = null,
            this._boundLoop = t.noOp,
            this._nextTick = 1 / 0,
            this.callback = null,
            this._state.dispose(),
            this._state = null
        }
        ,
        t.Clock
    }(Tone_core_Tone, Tone_signal_TimelineSignal);
    var metro;
    metro = function() {
        "use strict";
        var t = master
          , e = Tone_core_Clock;
        t.audiocontext,
        p5.Metro = function() {
            this.clock = new e({
                callback: this.ontick.bind(this)
            }),
            this.syncedParts = [],
            this.bpm = 120,
            this._init(),
            this.tickCallback = function() {}
        }
        ;
        var r = 0
          , n = 0;
        p5.Metro.prototype.ontick = function(e) {
            var i = e - r
              , o = e - t.audiocontext.currentTime;
            if (!(-.02 >= i - n)) {
                r = e;
                for (var s in this.syncedParts) {
                    var a = this.syncedParts[s];
                    a.incrementStep(o);
                    for (var h in a.phrases) {
                        var u = a.phrases[h]
                          , l = u.sequence
                          , p = this.metroTicks % l.length;
                        0 !== l[p] && (this.metroTicks < l.length || !u.looping) && u.callback(o, l[p])
                    }
                }
                this.metroTicks += 1,
                this.tickCallback(o)
            }
        }
        ,
        p5.Metro.prototype.setBPM = function(e, r) {
            var i = 60 / (e * this.tatums)
              , o = t.audiocontext.currentTime;
            n = i;
            var r = r || 0;
            this.clock.frequency.setValueAtTime(this.clock.frequency.value, o),
            this.clock.frequency.linearRampToValueAtTime(e, o + r),
            this.bpm = e
        }
        ,
        p5.Metro.prototype.getBPM = function(t) {
            return this.clock.getRate() / this.tatums * 60
        }
        ,
        p5.Metro.prototype._init = function() {
            this.metroTicks = 0
        }
        ,
        p5.Metro.prototype.resetSync = function(t) {
            this.syncedParts = [t]
        }
        ,
        p5.Metro.prototype.pushSync = function(t) {
            this.syncedParts.push(t)
        }
        ,
        p5.Metro.prototype.start = function(e) {
            var r = e || 0
              , n = t.audiocontext.currentTime;
            this.clock.start(n + r),
            this.setBPM(this.bpm)
        }
        ,
        p5.Metro.prototype.stop = function(e) {
            var r = e || 0
              , n = t.audiocontext.currentTime;
            this.clock._oscillator && this.clock.stop(n + r)
        }
        ,
        p5.Metro.prototype.beatLength = function(t) {
            this.tatums = 1 / t / 4
        }
    }(master, Tone_core_Clock);
    var looper;
    looper = function() {
        "use strict";
        function t(t) {
            t.currentPart++,
            t.currentPart >= t.parts.length ? (t.scoreStep = 0,
            t.onended()) : (t.scoreStep = 0,
            t.parts[t.currentPart - 1].stop(),
            t.parts[t.currentPart].start())
        }
        var e = master
          , r = 120;
        p5.prototype.setBPM = function(t, n) {
            r = t;
            for (var i in e.parts)
                e.parts[i].setBPM(r, n)
        }
        ,
        p5.Phrase = function(t, e, r) {
            this.phraseStep = 0,
            this.name = t,
            this.callback = e,
            this.sequence = r
        }
        ,
        p5.Part = function(t, n) {
            this.length = t || 0,
            this.partStep = 0,
            this.phrases = [],
            this.looping = !1,
            this.isPlaying = !1,
            this.onended = function() {
                this.stop()
            }
            ,
            this.tatums = n || .0625,
            this.metro = new p5.Metro,
            this.metro._init(),
            this.metro.beatLength(this.tatums),
            this.metro.setBPM(r),
            e.parts.push(this),
            this.callback = function() {}
        }
        ,
        p5.Part.prototype.setBPM = function(t, e) {
            this.metro.setBPM(t, e)
        }
        ,
        p5.Part.prototype.getBPM = function() {
            return this.metro.getBPM()
        }
        ,
        p5.Part.prototype.start = function(t) {
            if (!this.isPlaying) {
                this.isPlaying = !0,
                this.metro.resetSync(this);
                var e = t || 0;
                this.metro.start(e)
            }
        }
        ,
        p5.Part.prototype.loop = function(t) {
            this.looping = !0,
            this.onended = function() {
                this.partStep = 0
            }
            ;
            var e = t || 0;
            this.start(e)
        }
        ,
        p5.Part.prototype.noLoop = function() {
            this.looping = !1,
            this.onended = function() {
                this.stop()
            }
        }
        ,
        p5.Part.prototype.stop = function(t) {
            this.partStep = 0,
            this.pause(t)
        }
        ,
        p5.Part.prototype.pause = function(t) {
            this.isPlaying = !1;
            var e = t || 0;
            this.metro.stop(e)
        }
        ,
        p5.Part.prototype.addPhrase = function(t, e, r) {
            var n;
            if (3 === arguments.length)
                n = new p5.Phrase(t,e,r);
            else {
                if (!(arguments[0]instanceof p5.Phrase))
                    throw "invalid input. addPhrase accepts name, callback, array or a p5.Phrase";
                n = arguments[0]
            }
            this.phrases.push(n),
            n.sequence.length > this.length && (this.length = n.sequence.length)
        }
        ,
        p5.Part.prototype.removePhrase = function(t) {
            for (var e in this.phrases)
                this.phrases[e].name === t && this.phrases.split(e, 1)
        }
        ,
        p5.Part.prototype.getPhrase = function(t) {
            for (var e in this.phrases)
                if (this.phrases[e].name === t)
                    return this.phrases[e]
        }
        ,
        p5.Part.prototype.replaceSequence = function(t, e) {
            for (var r in this.phrases)
                this.phrases[r].name === t && (this.phrases[r].sequence = e)
        }
        ,
        p5.Part.prototype.incrementStep = function(t) {
            this.partStep < this.length - 1 ? (this.callback(t),
            this.partStep += 1) : (this.looping && this.callback(t),
            this.onended(),
            this.partStep = 0)
        }
        ,
        p5.Part.prototype.onStep = function(t) {
            this.callback = t
        }
        ,
        p5.Score = function() {
            this.parts = [],
            this.currentPart = 0;
            var e = this;
            for (var r in arguments)
                this.parts[r] = arguments[r],
                this.parts[r].nextPart = this.parts[r + 1],
                this.parts[r].onended = function() {
                    e.resetPart(r),
                    t(e)
                }
                ;
            this.looping = !1
        }
        ,
        p5.Score.prototype.onended = function() {
            this.looping ? this.parts[0].start() : this.parts[this.parts.length - 1].onended = function() {
                this.stop(),
                this.resetParts()
            }
            ,
            this.currentPart = 0
        }
        ,
        p5.Score.prototype.start = function() {
            this.parts[this.currentPart].start(),
            this.scoreStep = 0
        }
        ,
        p5.Score.prototype.stop = function() {
            this.parts[this.currentPart].stop(),
            this.currentPart = 0,
            this.scoreStep = 0
        }
        ,
        p5.Score.prototype.pause = function() {
            this.parts[this.currentPart].stop()
        }
        ,
        p5.Score.prototype.loop = function() {
            this.looping = !0,
            this.start()
        }
        ,
        p5.Score.prototype.noLoop = function() {
            this.looping = !1
        }
        ,
        p5.Score.prototype.resetParts = function() {
            for (var t in this.parts)
                this.resetPart(t)
        }
        ,
        p5.Score.prototype.resetPart = function(t) {
            this.parts[t].stop(),
            this.parts[t].partStep = 0;
            for (var e in this.parts[t].phrases)
                this.parts[t].phrases[e].phraseStep = 0
        }
        ,
        p5.Score.prototype.setBPM = function(t, e) {
            for (var r in this.parts)
                this.parts[r].setBPM(t, e)
        }
    }(master);
    var soundRecorder;
    soundRecorder = function() {
        "use strict";
        function t(t, e) {
            for (var r = t.length + e.length, n = new Float32Array(r), i = 0, o = 0; r > o; )
                n[o++] = t[i],
                n[o++] = e[i],
                i++;
            return n
        }
        function e(t, e, r) {
            for (var n = r.length, i = 0; n > i; i++)
                t.setUint8(e + i, r.charCodeAt(i))
        }
        var r = master
          , n = r.audiocontext;
        p5.SoundRecorder = function() {
            this.input = n.createGain(),
            this.output = n.createGain(),
            this.recording = !1,
            this.bufferSize = 1024,
            this._channels = 2,
            this._clear(),
            this._jsNode = n.createScriptProcessor(this.bufferSize, this._channels, 2),
            this._jsNode.onaudioprocess = this._audioprocess.bind(this),
            this._callback = function() {}
            ,
            this._jsNode.connect(p5.soundOut._silentNode),
            this.setInput(),
            r.soundArray.push(this)
        }
        ,
        p5.SoundRecorder.prototype.setInput = function(t) {
            this.input.disconnect(),
            this.input = null,
            this.input = n.createGain(),
            this.input.connect(this._jsNode),
            this.input.connect(this.output),
            t ? t.connect(this.input) : p5.soundOut.output.connect(this.input)
        }
        ,
        p5.SoundRecorder.prototype.record = function(t, e, r) {
            this.recording = !0,
            e && (this.sampleLimit = Math.round(e * n.sampleRate)),
            t && r ? this._callback = function() {
                this.buffer = this._getBuffer(),
                t.setBuffer(this.buffer),
                r()
            }
            : t && (this._callback = function() {
                this.buffer = this._getBuffer(),
                t.setBuffer(this.buffer)
            }
            )
        }
        ,
        p5.SoundRecorder.prototype.stop = function() {
            this.recording = !1,
            this._callback(),
            this._clear()
        }
        ,
        p5.SoundRecorder.prototype._clear = function() {
            this._leftBuffers = [],
            this._rightBuffers = [],
            this.recordedSamples = 0,
            this.sampleLimit = null
        }
        ,
        p5.SoundRecorder.prototype._audioprocess = function(t) {
            if (this.recording !== !1 && this.recording === !0)
                if (this.sampleLimit && this.recordedSamples >= this.sampleLimit)
                    this.stop();
                else {
                    var e = t.inputBuffer.getChannelData(0)
                      , r = t.inputBuffer.getChannelData(1);
                    this._leftBuffers.push(new Float32Array(e)),
                    this._rightBuffers.push(new Float32Array(r)),
                    this.recordedSamples += this.bufferSize
                }
        }
        ,
        p5.SoundRecorder.prototype._getBuffer = function() {
            var t = [];
            return t.push(this._mergeBuffers(this._leftBuffers)),
            t.push(this._mergeBuffers(this._rightBuffers)),
            t
        }
        ,
        p5.SoundRecorder.prototype._mergeBuffers = function(t) {
            for (var e = new Float32Array(this.recordedSamples), r = 0, n = t.length, i = 0; n > i; i++) {
                var o = t[i];
                e.set(o, r),
                r += o.length
            }
            return e
        }
        ,
        p5.SoundRecorder.prototype.dispose = function() {
            this._clear();
            var t = r.soundArray.indexOf(this);
            r.soundArray.splice(t, 1),
            this._callback = function() {}
            ,
            this.input && this.input.disconnect(),
            this.input = null,
            this._jsNode = null
        }
        ,
        p5.prototype.saveSound = function(r, n) {
            var i = r.buffer.getChannelData(0)
              , o = r.buffer.getChannelData(1)
              , s = t(i, o)
              , a = new ArrayBuffer(44 + 2 * s.length)
              , h = new DataView(a);
            e(h, 0, "RIFF"),
            h.setUint32(4, 44 + 2 * s.length, !0),
            e(h, 8, "WAVE"),
            e(h, 12, "fmt "),
            h.setUint32(16, 16, !0),
            h.setUint16(20, 1, !0),
            h.setUint16(22, 2, !0),
            h.setUint32(24, 44100, !0),
            h.setUint32(28, 176400, !0),
            h.setUint16(32, 4, !0),
            h.setUint16(34, 16, !0),
            e(h, 36, "data"),
            h.setUint32(40, 2 * s.length, !0);
            for (var u = s.length, l = 44, p = 1, c = 0; u > c; c++)
                h.setInt16(l, s[c] * (32767 * p), !0),
                l += 2;
            p5.prototype.writeFile([h], n, "wav")
        }
    }(sndcore, master);
    var peakdetect;
    peakdetect = function() {
        "use strict";
        p5.PeakDetect = function(t, e, r, n) {
            this.framesPerPeak = n || 20,
            this.framesSinceLastPeak = 0,
            this.decayRate = .95,
            this.threshold = r || .35,
            this.cutoff = 0,
            this.cutoffMult = 1.5,
            this.energy = 0,
            this.penergy = 0,
            this.currentValue = 0,
            this.isDetected = !1,
            this.f1 = t || 40,
            this.f2 = e || 2e4,
            this._onPeak = function() {}
        }
        ,
        p5.PeakDetect.prototype.update = function(t) {
            var e = this.energy = t.getEnergy(this.f1, this.f2) / 255;
            e > this.cutoff && e > this.threshold && e - this.penergy > 0 ? (this._onPeak(),
            this.isDetected = !0,
            this.cutoff = e * this.cutoffMult,
            this.framesSinceLastPeak = 0) : (this.isDetected = !1,
            this.framesSinceLastPeak <= this.framesPerPeak ? this.framesSinceLastPeak++ : (this.cutoff *= this.decayRate,
            this.cutoff = Math.max(this.cutoff, this.threshold))),
            this.currentValue = e,
            this.penergy = e
        }
        ,
        p5.PeakDetect.prototype.onPeak = function(t, e) {
            var r = this;
            r._onPeak = function() {
                t(r.energy, e)
            }
        }
    }(master);
    var gain;
    gain = function() {
        "use strict";
        var t = master;
        p5.Gain = function() {
            this.ac = t.audiocontext,
            this.input = this.ac.createGain(),
            this.output = this.ac.createGain(),
            this.input.gain.value = .5,
            this.input.connect(this.output),
            t.soundArray.push(this)
        }
        ,
        p5.Gain.prototype.setInput = function(t) {
            t.connect(this.input)
        }
        ,
        p5.Gain.prototype.connect = function(t) {
            var e = t || p5.soundOut.input;
            this.output.connect(e.input ? e.input : e)
        }
        ,
        p5.Gain.prototype.disconnect = function() {
            this.output.disconnect()
        }
        ,
        p5.Gain.prototype.amp = function(e, r, n) {
            var r = r || 0
              , n = n || 0
              , i = t.audiocontext.currentTime
              , o = this.output.gain.value;
            this.output.gain.cancelScheduledValues(i),
            this.output.gain.linearRampToValueAtTime(o, i + n),
            this.output.gain.linearRampToValueAtTime(e, i + n + r)
        }
        ,
        p5.Gain.prototype.dispose = function() {
            var e = t.soundArray.indexOf(this);
            t.soundArray.splice(e, 1),
            this.output.disconnect(),
            this.input.disconnect(),
            this.output = void 0,
            this.input = void 0
        }
    }(master, sndcore);
    var src_app;
    src_app = function() {
        "use strict";
        var t = sndcore;
        return t
    }(sndcore, master, helpers, errorHandler, panner, soundfile, amplitude, fft, signal, oscillator, env, pulse, noise, audioin, filter, delay, reverb, metro, looper, soundRecorder, peakdetect, gain)
});
