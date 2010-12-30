###
Licensed under BSD http://en.wikipedia.org/wiki/BSD_License
Copyright (c) 2010, Duponchel David
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the GraouPack nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DUPONCHEL DAVID BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
###

"use strict"

xmlCompat =
  w3c : typeof XMLSerializer isnt "undefined" and
      document.implementation and document.implementation.createDocument and typeof document.implementation.createDocument isnt "undefined",
  ie : typeof window.ActiveXObject isnt "undefined"

if not xmlCompat.w3c and not xmlCompat.ie
  throw new Error("XML generation : this browser doesn't seem to be recent enough")

$.Class.extend("Graoupack.Xml", {
  ###*
   * Create a new XML document.
   * @Param {String} rootName the name of the root element
   * @Return {Graoupack.Xml} The root element.
  *###
  createDocument : if xmlCompat.w3c
  then (rootName) ->
    xmlDocument = document.implementation.createDocument("", rootName, null)
    return new Graoupack.Xml(xmlDocument, xmlDocument.childNodes[0])
  else (rootName) ->
    doc = new ActiveXObject("MSXML2.DOMDocument")
    xmlDocument = doc.loadXML("<" + rootName + "/>")
    return new Graoupack.Xml(xmlDocument, xmlDocument.childNodes[0])
}, {

  ###*
   * Returns (and create if it doesn't exist) the element targeted by 'path'.
   * @param {String} path The path to the xml element. It has the following pattern :
   * (/\w+)+ for example /installation/subElement/subSubElement...
   * @return {XMLElement} the xml element.
  *###
  get : (path) ->

    if not path.match(/(\/\w+)+/)
      throw "The path must follow the pattern (/\\w+)+ !"

    nodeNames = path.split("/")

    # get rid of the first / (creates a "")
    nodeNames.shift()

    # this element targets the xml document and not its first element
    # to avoid treating differently the first element.
    currentNode = new Graoupack.Xml(this.xmlDocument, this.xmlDocument)

    # for each level
    for nodeName in nodeNames
      xmlChildren = currentNode.getChildren()
      childNb = 0
      found = false
      # looking for an existing node
      while not found and childNb < xmlChildren.length
        xmlChild = xmlChildren[childNb++]
        if xmlChild.getName().toLowerCase() is nodeName.toLowerCase()
          found = true
          currentNode = xmlChild

      if not found
        currentNode = currentNode.createChild(nodeName)

    return currentNode

  ###*
   * Generate the indented xml string.
   * @return {String} the string representing the xml.
  *###
  toXMLString : ->
    ###
    It can't pass by an xslt transformation :
    the effet of indent = "yes" depends of the browser (and firefox doesn't indent).
    @see http://www.w3.org/TR/xslt#output :
    "indent specifies whether the XSLT processor <strong>may</strong> add additional whitespace
    when outputting the result tree; the value must be yes or no"
    ###

    # from http://svg-edit.googlecode.com/svn/trunk/editor/svgcanvas.js
    convertToXMLReferences = (input) ->
      output = ''
      for n in [0...input.length]
        c = input.charCodeAt(n)
        output += input.charAt(n) if c < 128
        output += ("&#" + c + ";") if c > 127
      return output

    input = this.toRawXMLString()
    output = ""
    depth = 0
    sameLine = false # used when </foo> goes after <foo>bar
    append = (fragment) ->
      output += fragment
    indent = (depth) ->
      for i in [0...depth]
        output += "  "
    newLine = ->
      output += "\r\n"; # damn windows

    # we don't always have an xml declaration : we remove it and add our own
    input = input.replace(/<\?xml[^>]+>\s*/, "")

    # we sometimes (IE) have extra new lines...
    input = $.trim(input)

    # other way : we can use E4X. /!\ don't use CDATA !
    # see https://developer.mozilla.org/en/Parsing_and_serializing_XML#.22Pretty.22_serialization_of_DOM_trees_to_strings
    # output = XML(input).toXMLString();


    sameLine = false; # used when </foo> goes after <foo>bar
    fragments = input.match(/<[^>]+>[^<]*/gi)

    output += '<?xml version="1.0" encoding="utf-8" standalone="yes" ?>'
    newLine()

    for fragment in fragments
      if fragment.match(/>.+/) # <---->blabla
        indent(depth)
        sameLine = true
        append(fragment)
      else if fragment.match(/\/>$/) # <----/>
        indent(depth)
        append(fragment)
        newLine()
      else if fragment.match(/<[^\/]+>/) # <---->
        indent(depth++)
        append(fragment)
        newLine()
      else if fragment.match(/<\//) # </---->
        if sameLine
          append(fragment)
          sameLine = false
        else
          indent(--depth)
          append(fragment)
        newLine()
      else # should not happen
        append(fragment)

    output = convertToXMLReferences($.trim output)


  ###*
   * Generate a raw string from this xml.
   * @Return {String} the xml
  *###
  toRawXMLString : if xmlCompat.w3c
  then ->
    new XMLSerializer().serializeToString(@xmlDocument)
  else ->
    @xmlDocument.xml

  ###*
   * Count the elements matched by the xpath string.
   * @Param {String} xpath the selector.
   * @Return {integer} The number.
  *###
  count : if xmlCompat.w3c
  then (xpath) ->
    return @xmlDocument.evaluate("count(" + xpath + ")", @xmlDocument, null, XPathResult.NUMBER_TYPE, null).numberValue
  else (xpath) ->
    return @xmlDocument.selectNodes(xpath).length

  ###*
   * Create a node. This should only be used internally. To create a document,
   * use the static method createDocument.
   * @Param {Document} the xml document of this node.
   * @Param {XMLElement} the current xml element.
  *###
  init : (xmlDocument, xmlNode) ->
    @xmlDocument = xmlDocument
    @xmlNode = xmlNode

  ###*
   * Create a child of this xml node.
   * @Param {String} name the node name.
   * @Return {Graoupack.Xml} the created child.
  *###
  createChild : (name) ->
    newElement = @xmlDocument.createElement(name)
    @xmlNode.appendChild(newElement)
    return new Graoupack.Xml(@xmlDocument, newElement)

  ###*
   * Get the children of the current node.
   * @Return {[Graoupack.Xml]} the children
  *###
  getChildren : ->
    (new Graoupack.Xml(@xmlDocument, childNode) for childNode in @xmlNode.childNodes)

  ###*
   * get the name of the node.
   * @Return {String} the node name
  *###
  getName : if xmlCompat.w3c
  then ->
    @xmlNode.localName
  else ->
    @xmlNode.nodeName

  ###*
   * set an attribute on the current node.
   * @Param {String} key the name of the attribute
   * @Param {String} value the content of the attribute
  *###
  setAttribute : (key, value) ->
    @xmlNode.setAttribute(key, value + "")

  ###*
   * get an attribute on the current node
   * @Param {String} key attribute name
   * @Return {String} the attribute.
  *###
  getAttribute : (key) ->
    return this.xmlNode.getAttribute(key)

  ###*
   * change the textual content of the current node.
   * @Param {String} content the new content
  *###
  setContent : if xmlCompat.w3c
  then (content) ->
    @xmlNode.textContent = content
  else (content) ->
    @xmlNode.text = content

  ###*
   * get the content of the current node.
   * @Return {String} the textual content.
  *###
  getContent : if xmlCompat.w3c
  then ->
    @xmlNode.textContent
  else ->
    @xmlNode.nodeValue
})
