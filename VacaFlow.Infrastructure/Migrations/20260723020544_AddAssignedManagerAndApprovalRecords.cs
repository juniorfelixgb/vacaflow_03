using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VacaFlow.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAssignedManagerAndApprovalRecords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AssignedManagerId",
                table: "Employees",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ApprovalRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    RequestId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ApproverId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Decision = table.Column<int>(type: "INTEGER", nullable: false),
                    Comment = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApprovalRecords", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRecords_ApproverId",
                table: "ApprovalRecords",
                column: "ApproverId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRecords_RequestId_Unique",
                table: "ApprovalRecords",
                column: "RequestId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApprovalRecords");

            migrationBuilder.DropColumn(
                name: "AssignedManagerId",
                table: "Employees");
        }
    }
}
