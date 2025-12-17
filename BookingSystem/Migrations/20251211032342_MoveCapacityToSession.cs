using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingSystem.Migrations
{
    /// <inheritdoc />
    public partial class MoveCapacityToSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxCapacity",
                table: "Classes");

            migrationBuilder.AddColumn<int>(
                name: "MaxCapacity",
                table: "ClassSessions",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxCapacity",
                table: "ClassSessions");

            migrationBuilder.AddColumn<int>(
                name: "MaxCapacity",
                table: "Classes",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
