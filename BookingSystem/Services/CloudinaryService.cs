using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace BookingSystem.Services;

public interface ICloudinaryService
{
    Task<string?> UploadImageAsync(IFormFile file, string folder = "bookingsystem");
    Task<bool> DeleteImageAsync(string publicId);
}

public class CloudinaryService(IConfiguration configuration) : ICloudinaryService
{
    private readonly Cloudinary _cloudinary = new(configuration["Cloudinary:Url"]);

    public async Task<string?> UploadImageAsync(IFormFile file, string folder = "bookingsystem")
    {
        if (file == null || file.Length == 0)
            return null;

        try
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new AutoUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
                return null;

            return uploadResult.SecureUrl?.ToString();
        }
        catch
        {
            return null;
        }
    }


    public async Task<bool> DeleteImageAsync(string publicId)
    {
        try
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok";
        }
        catch
        {
            return false;
        }
    }
}
