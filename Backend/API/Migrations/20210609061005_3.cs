using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JobNumber",
                table: "Panels");

            migrationBuilder.RenameColumn(
                name: "Note",
                table: "Panels",
                newName: "Description");

            migrationBuilder.AddColumn<int>(
                name: "JobId",
                table: "Panels",
                type: "int",
                maxLength: 100,
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Job",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    JobNumber = table.Column<string>(type: "varchar(100) CHARACTER SET utf8mb4", maxLength: 100, nullable: false),
                    CutttingStart = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CutttingEnd = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    SandingStart = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    SandingEnd = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    BaseCoatingStart = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    BaseCoatingEnd = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    TopCoatingStart = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    TopCoatingEnd = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    PackingStart = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    PackingEnd = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Description = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Status = table.Column<string>(type: "varchar(100) CHARACTER SET utf8mb4", maxLength: 100, nullable: true),
                    DateModified = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Job", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Panels_JobId",
                table: "Panels",
                column: "JobId");

            migrationBuilder.AddForeignKey(
                name: "FK_Panels_Job_JobId",
                table: "Panels",
                column: "JobId",
                principalTable: "Job",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Panels_Job_JobId",
                table: "Panels");

            migrationBuilder.DropTable(
                name: "Job");

            migrationBuilder.DropIndex(
                name: "IX_Panels_JobId",
                table: "Panels");

            migrationBuilder.DropColumn(
                name: "JobId",
                table: "Panels");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Panels",
                newName: "Note");

            migrationBuilder.AddColumn<string>(
                name: "JobNumber",
                table: "Panels",
                type: "varchar(100) CHARACTER SET utf8mb4",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
