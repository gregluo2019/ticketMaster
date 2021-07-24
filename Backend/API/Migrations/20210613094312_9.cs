using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _9 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_AspNetUsers_BaseCoatingStaffId",
                table: "Jobs");

            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_AspNetUsers_CuttingStaffId",
                table: "Jobs");

            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_AspNetUsers_PackingStaffId",
                table: "Jobs");

            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_AspNetUsers_SandingStaffId",
                table: "Jobs");

            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_AspNetUsers_TopCoatingStaffId",
                table: "Jobs");

            migrationBuilder.DropIndex(
                name: "IX_Jobs_BaseCoatingStaffId",
                table: "Jobs");

            migrationBuilder.DropIndex(
                name: "IX_Jobs_CuttingStaffId",
                table: "Jobs");

            migrationBuilder.DropIndex(
                name: "IX_Jobs_PackingStaffId",
                table: "Jobs");

            migrationBuilder.DropIndex(
                name: "IX_Jobs_SandingStaffId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "BaseCoatingStaffId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "CuttingStaffId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "PackingStaffId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "SandingStaffId",
                table: "Jobs");

            migrationBuilder.RenameColumn(
                name: "TopCoatingStaffId",
                table: "Jobs",
                newName: "StaffId");

            migrationBuilder.RenameIndex(
                name: "IX_Jobs_TopCoatingStaffId",
                table: "Jobs",
                newName: "IX_Jobs_StaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_AspNetUsers_StaffId",
                table: "Jobs",
                column: "StaffId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_AspNetUsers_StaffId",
                table: "Jobs");

            migrationBuilder.RenameColumn(
                name: "StaffId",
                table: "Jobs",
                newName: "TopCoatingStaffId");

            migrationBuilder.RenameIndex(
                name: "IX_Jobs_StaffId",
                table: "Jobs",
                newName: "IX_Jobs_TopCoatingStaffId");

            migrationBuilder.AddColumn<string>(
                name: "BaseCoatingStaffId",
                table: "Jobs",
                type: "varchar(255) CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CuttingStaffId",
                table: "Jobs",
                type: "varchar(255) CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PackingStaffId",
                table: "Jobs",
                type: "varchar(255) CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SandingStaffId",
                table: "Jobs",
                type: "varchar(255) CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_BaseCoatingStaffId",
                table: "Jobs",
                column: "BaseCoatingStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_CuttingStaffId",
                table: "Jobs",
                column: "CuttingStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_PackingStaffId",
                table: "Jobs",
                column: "PackingStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_SandingStaffId",
                table: "Jobs",
                column: "SandingStaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_AspNetUsers_BaseCoatingStaffId",
                table: "Jobs",
                column: "BaseCoatingStaffId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_AspNetUsers_CuttingStaffId",
                table: "Jobs",
                column: "CuttingStaffId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_AspNetUsers_PackingStaffId",
                table: "Jobs",
                column: "PackingStaffId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_AspNetUsers_SandingStaffId",
                table: "Jobs",
                column: "SandingStaffId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_AspNetUsers_TopCoatingStaffId",
                table: "Jobs",
                column: "TopCoatingStaffId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
