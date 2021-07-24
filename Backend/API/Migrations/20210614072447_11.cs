using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WeekdayTimes",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "canCantonese",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "canDriveCar",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "canEnglish",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "canMandarin",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "canShangHai",
                table: "AspNetUsers",
                newName: "IsManager");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsManager",
                table: "AspNetUsers",
                newName: "canShangHai");

            migrationBuilder.AddColumn<string>(
                name: "WeekdayTimes",
                table: "AspNetUsers",
                type: "varchar(200) CHARACTER SET utf8mb4",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "canCantonese",
                table: "AspNetUsers",
                type: "tinyint(1)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "canDriveCar",
                table: "AspNetUsers",
                type: "tinyint(1)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "canEnglish",
                table: "AspNetUsers",
                type: "tinyint(1)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "canMandarin",
                table: "AspNetUsers",
                type: "tinyint(1)",
                nullable: true);
        }
    }
}
