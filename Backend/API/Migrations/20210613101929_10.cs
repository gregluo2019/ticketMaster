using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _10 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_AspNetUsers_StaffId",
                table: "Jobs");

            migrationBuilder.DropIndex(
                name: "IX_Jobs_StaffId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "BaseCoatingEnd",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "BaseCoatingStart",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "CuttingEnd",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "CuttingStart",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "PackingEnd",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "PackingStart",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "SandingEnd",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "SandingStart",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "StaffId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "TopCoatingEnd",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "TopCoatingStart",
                table: "Jobs");

            migrationBuilder.CreateTable(
                name: "JobUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    JobId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "varchar(255) CHARACTER SET utf8mb4", nullable: false),
                    Action = table.Column<string>(type: "varchar(100) CHARACTER SET utf8mb4", maxLength: 100, nullable: true),
                    Time = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DateModified = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobUsers_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobUsers_Jobs_JobId",
                        column: x => x.JobId,
                        principalTable: "Jobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobUsers_JobId",
                table: "JobUsers",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_JobUsers_UserId",
                table: "JobUsers",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobUsers");

            migrationBuilder.AddColumn<DateTime>(
                name: "BaseCoatingEnd",
                table: "Jobs",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "BaseCoatingStart",
                table: "Jobs",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CuttingEnd",
                table: "Jobs",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CuttingStart",
                table: "Jobs",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PackingEnd",
                table: "Jobs",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PackingStart",
                table: "Jobs",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SandingEnd",
                table: "Jobs",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SandingStart",
                table: "Jobs",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StaffId",
                table: "Jobs",
                type: "varchar(255) CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TopCoatingEnd",
                table: "Jobs",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TopCoatingStart",
                table: "Jobs",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_StaffId",
                table: "Jobs",
                column: "StaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_AspNetUsers_StaffId",
                table: "Jobs",
                column: "StaffId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
