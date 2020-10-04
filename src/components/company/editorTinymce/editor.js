import React, { Component } from "react"
import { Editor } from "@tinymce/tinymce-react"
import { EDITOR_API } from "../../../setting"

class EditorTinymce extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { value } = this.props
    const { handleAction } = this.props
    return (
      <Editor
        apiKey={EDITOR_API}
        init={{
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          font_formats:
            "Inter, sans-serif ;Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Open Sans=Open Sans,helvetica,sans-serif;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats",
          content_style: "body {  font-family: Inter, sans-serif; font-size: 16px}  pre,p,span {font-size: 16px}",
          toolbar:
            "undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help",
        }}
        value={value || null}
        onEditorChange={handleAction}
      />
    )
  }
}

export default EditorTinymce
