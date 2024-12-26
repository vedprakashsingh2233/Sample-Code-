
$(document).ready(function () {
    BindSubCategory();
    showRecord();
});
function BindSubCategory() {
    $.post("/Admin/ShowSubCategoryList",
        {},
        function (data) {
            var jsonData = JSON.parse(data.Data);
            $('#ddlSubCategory').html("").append('<option value="0">Select Category</option>');
            $(jsonData).each(function () {
                $('#ddlSubCategory').append('<option value=' + this.Id + '>' + this.SubCategoryName + '</option>');
            });
        }).fail(function (edata) {
            alert("error while feching record.");
        });
};

function InsertUpdate() {
    if ($("#ddlCategoryId").val() == "0") {
        alert('Please Select Category ');
        $("#ddlCategoryId").focus();
    }
    else if ($("#txtSubCategoryName").val() == "") {
        alert('Please Enter Sub Category Name');
        $("#txtSubCategoryName").focus();
    }


    else {
        $.post("/Admin/InsertUpdateSubCategoryMaster",
            {
                Id: $("#hdId").val(),
                SubCategoryName: $("#txtSubCategoryName").val(),
                Heading1: $("#txtHeading1").val(),
                Heading2: $("#txtHeading2").val(),
                Heading3: $("#txtHeading3").val(),
                Heading4: $("#txtHeading4").val(),
                Category_Id_FK: $("#ddlCategoryId").val(),
                IsActive: $("#chkIsActive").is(':checked') ? 1 : 0,
            },
            function (data) {
                if (data.Result != "") {
                    alert(data.Result);
                    ClearData();
                    showRecord();
                }
            });
    }
}
function showRecord() {
    $.post("/Admin/ShowSubCategoryList",
        {},
        function (data) {
            if (data.Data != undefined && data.Data != "") {
                var jsonData = JSON.parse(data.Data);
                $('#tblBookList').DataTable().destroy()
                $('#tblBookList').DataTable({
                    data: jsonData,
                    columns: [
                        { data: "SubCategoryName", title: "Sub Category Name" },
                        { data: "Heading1", title: "Heading 1" },
                        { data: "CategoryName", title: "Category Name" },
                        {
                            render: function (data, type, row, meta) {
                                return '<button onclick="EditRecord(\'' + row.Id + '\')" class="btn btn-success">Edit</button>';
                            },
                            title: "Edit"
                        },
                        {
                            render: function (data, type, row, meta) {
                                return '<button onclick="DeleteRecord(\'' + row.Id + '\')" class="btn btn-danger">Delete</button>';
                            },
                            title: "Delete"
                        },
                    ]
                });
            }
            else {
                $('#tblBookList').DataTable().clear().destroy();
            }
            if (data.Result != "") {
                alert(data.Result)
            }
        });

}
function EditRecord(Id) {
    $.post("/Admin/EditSubCategory",
        { Id: Id },
        function (data) {
            if (data.Result == "") {
                var Data = JSON.parse(data.Record);
                $.each(Data, function (index, Value) {
                    $('#hdId').val(Value.Id),
                        $('#txtSubCategoryName').val(Value.SubCategoryName),
                        $('#ddlCategoryId').val(Value.Category_Id_FK),
                        $('#txtHeading1').val(Value.Heading1),
                        $('#txtHeading2').val(Value.Heading2),
                        $('#txtHeading3').val(Value.Heading3),
                        $('#txtHeading4').val(Value.Heading4),
                        $('#chkIsActive').prop('checked', Value.IsActive == 1 ? true : false);
                })
                $('#btnSave').text('Update');
            }
            else {
                alert(data.Result);
            }
        });
}
function DeleteRecord(Id) {
    if (confirm("Do you want to delete this ?")) {
        $.post("/Admin/DeleteSubCategory",
            { Id: Id },
            function (data) {
                if (data.Result != "") {
                    alert(data.Result);
                    showRecord();
                }
            });
    }
}
function ClearData() {
    $("#hdId").val("0");
    $("#txtSubCategoryName").val("");
    $("#txtHeading1").val("");
    $("#txtHeading2").val("");
    $("#txtHeading3").val("");
    $("#txtHeading4").val("");
    $("#ddlCategoryId").val("0");
    $('#btnSave').text('Save');
}