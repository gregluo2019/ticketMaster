using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CutttingStart",
                table: "Jobs",
                newName: "CuttingStart");

            migrationBuilder.RenameColumn(
                name: "CutttingEnd",
                table: "Jobs",
                newName: "CuttingEnd");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CuttingStart",
                table: "Jobs",
                newName: "CutttingStart");

            migrationBuilder.RenameColumn(
                name: "CuttingEnd",
                table: "Jobs",
                newName: "CutttingEnd");
        }
    }
}
